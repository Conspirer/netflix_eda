from flask import Flask, jsonify
from flask_cors import CORS
from eda_utils import load_and_clean_data
import pandas as pd


app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"message": "Netflix EDA Backend is Running!"}

@app.route("/api/summary")
def get_summary():
    df = load_and_clean_data()
    summary = {
        "total_titles": len(df),
        "total_movies": df[df['type'] == 'Movie'].shape[0],
        "total_shows": df[df['type'] == 'TV Show'].shape[0],
        "earliest_year": int(df['release_year'].min()),
        "latest_year": int(df['release_year'].max()),
    }
    return jsonify(summary)

@app.route("/api/titles-per-year")
def titles_per_year():
    df = load_and_clean_data()
    result = df.groupby(['year_added', 'type']).size().unstack().fillna(0)
    result = result.reset_index()
    result = result.rename(columns={'Movie': 'Movies', 'TV Show': 'TV_Shows'})
    return jsonify(result.to_dict(orient="records"))


@app.route("/api/genres-over-time")
def genres_over_time():
    df = load_and_clean_data()

    # Drop missing values
    df = df.dropna(subset=['listed_in', 'year_added'])

    # Split multiple genres per title
    df = df.assign(genre=df['listed_in'].str.split(', '))
    df = df.explode('genre')

    # Group by year and genre, count
    grouped = df.groupby(['year_added', 'genre']).size().reset_index(name='count')

    # Filter top 5 genres by total count across all years
    top_genres = (
        grouped.groupby('genre')['count'].sum()
        .sort_values(ascending=False)
        .head(5)
        .index
    )

    # Filter to only top genres
    grouped = grouped[grouped['genre'].isin(top_genres)]

    # Return data
    return jsonify(grouped.to_dict(orient='records'))


@app.route("/api/top-genres")
def top_genres():
    df = load_and_clean_data()
    df = df.dropna(subset=['listed_in', 'year_added'])
    df = df.assign(genre=df['listed_in'].str.split(', '))
    df = df.explode('genre')

    top_genres = (
        df['genre'].value_counts()
        .head(5)
        .index.tolist()
    )

    return jsonify(top_genres)


@app.route("/api/country-genre-heatmap")
def country_genre_heatmap():
    df = load_and_clean_data()

    df = df.dropna(subset=['country', 'listed_in'])
    df = df.assign(
        country=df['country'].str.split(', '),
        genre=df['listed_in'].str.split(', ')
    )
    df = df.explode('country')
    df = df.explode('genre')

    # Limit to top 10 countries and top 10 genres
    top_countries = df['country'].value_counts().head(10).index
    top_genres = df['genre'].value_counts().head(10).index

    df = df[df['country'].isin(top_countries) & df['genre'].isin(top_genres)]

    pivot = df.groupby(['country', 'genre']).size().unstack(fill_value=0)
    pivot = pivot.loc[top_countries, top_genres]  # maintain order

    return jsonify({
        "countries": list(pivot.index),
        "genres": list(pivot.columns),
        "matrix": pivot.values.tolist()
    })


@app.route("/api/family-penetration")
def family_penetration():
    df = load_and_clean_data()
    df = df.dropna(subset=["country", "rating", "type"])
    df = df.assign(country=df["country"].str.split(", ")).explode("country")

    # Normalize ratings
    df["rating"] = df["rating"].str.strip().str.upper()
    family_ratings = [r.upper() for r in ['G', 'TV-G', 'TV-Y', 'TV-Y7', 'PG', 'TV-PG']]

    # Group counts
    total_content = df.groupby("country").size()
    family_content = df[df["rating"].isin(family_ratings)].groupby("country").size()

    score_df = pd.DataFrame({
        "total": total_content,
        "family": family_content
    }).fillna(0)

    # 🔥 Filter out countries with fewer than 50 titles
    score_df = score_df[score_df["total"] >= 50]

    score_df["family_penetration"] = (score_df["family"] / score_df["total"]) * 100
    score_df = score_df.sort_values(by="family_penetration", ascending=False).head(10)

    return jsonify(score_df.reset_index().to_dict(orient="records"))



@app.route("/api/content-timing")
def content_timing():
    df = load_and_clean_data()

    # Clean & filter
    df = df.dropna(subset=["date_added", "rating"])
    df["date_added"] = pd.to_datetime(df["date_added"], errors="coerce")
    df["month"] = df["date_added"].dt.month_name()
    df["rating"] = df["rating"].str.strip().str.upper()

    # Focus on most common ratings (to keep chart readable)
    common_ratings = [
    'TV-MA', 'TV-14', 'TV-PG', 'PG', 'PG-13', 'R', 'TV-G', 'TV-Y7', 'TV-Y'
]


    df = df[df["rating"].isin(common_ratings)]

    # Group by month and rating
    grouped = df.groupby(["month", "rating"]).size().reset_index(name="count")

    # Optional: sort months Jan–Dec
    month_order = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    grouped["month"] = pd.Categorical(grouped["month"], categories=month_order, ordered=True)
    grouped = grouped.sort_values(by=["month", "rating"])

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/genre-rating")
def genre_rating():
    df = load_and_clean_data()

    df = df.dropna(subset=["listed_in", "rating"])
    df["rating"] = df["rating"].str.strip().str.upper()
    df["listed_in"] = df["listed_in"].str.split(", ")

    exploded = df.explode("listed_in")
    exploded["listed_in"] = exploded["listed_in"].str.strip()

    common_ratings = ['TV-G', 'TV-Y', 'TV-Y7', 'PG', 'PG-13', 'TV-PG', 'TV-14', 'TV-MA', 'R']

    grouped = (
        exploded[exploded["rating"].isin(common_ratings)]
        .groupby(["listed_in", "rating"])
        .size()
        .reset_index(name="count")
        .sort_values(by="count", ascending=False)
    )

    return jsonify(grouped.to_dict(orient="records"))



@app.route("/api/global-director-metrics")
def global_director_metrics():
    df = load_and_clean_data()

    df = df.dropna(subset=["director", "country", "rating", "listed_in"])
    df["director"] = df["director"].str.strip()
    df["country"] = df["country"].str.split(", ")
    df["listed_in"] = df["listed_in"].str.split(", ")

    df = df.explode("country").explode("listed_in")
    df["country"] = df["country"].str.strip()
    df["listed_in"] = df["listed_in"].str.strip()
    df["rating"] = df["rating"].str.upper().str.strip()

    # Group by director
    grouped = df.groupby("director").agg({
        "country": pd.Series.nunique,
        "rating": pd.Series.nunique,
        "listed_in": pd.Series.nunique
    }).reset_index()

    grouped.columns = ["director", "Countries", "Ratings", "Genres"]

    # Top 10 directors with widest country spread
    top_directors = grouped.sort_values(by="Countries", ascending=False).head(10)

    return jsonify(top_directors.to_dict(orient="records"))


@app.route("/api/lifecycle-lag")
def content_lifecycle_lag():
    df = load_and_clean_data()

    # Ensure required columns exist
    df = df.dropna(subset=["release_year", "date_added", "rating", "type"])

    # Convert 'date_added' to datetime
    df["date_added"] = pd.to_datetime(df["date_added"], errors="coerce")
    df = df.dropna(subset=["date_added"])

    # Standardize and clean 'rating'
    df["rating"] = df["rating"].astype(str).str.upper().str.strip()

    # Filter out invalid ratings (junk rows)
    invalid_ratings = df["rating"].str.contains("MIN|HR|MOVIE|DOCUMENTARY|SEASON", case=False, na=False)
    df = df[~invalid_ratings]

    # Calculate lag in years between release and addition to Netflix
    df["lag_years"] = df["date_added"].dt.year - df["release_year"]

    # Remove negative or overly large lag values
    df = df[(df["lag_years"] >= 0) & (df["lag_years"] <= 30)]

    # Group by rating and type, calculate average lag
    grouped = df.groupby(["rating", "type"])["lag_years"].mean().reset_index()

    # Sort by lag in descending order
    grouped = grouped.sort_values(by="lag_years", ascending=False)

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/sweet-spot")
def sweet_spot():
    df = load_and_clean_data()
    df = df.dropna(subset=["listed_in", "rating", "country", "type", "duration"])
    
    df["listed_in"] = df["listed_in"].str.split(", ")
    df["rating"] = df["rating"].astype(str).str.upper().str.strip()
    df["country"] = df["country"].str.split(", ")
    df = df.explode("listed_in").explode("country")
    df["listed_in"] = df["listed_in"].str.strip()
    df["country"] = df["country"].str.strip()

    # Clean ratings
    bad_ratings = df["rating"].str.contains("MIN|HR|MOVIE|DOCUMENTARY|SEASON", case=False, na=False)
    df = df[~bad_ratings]

    # Separate duration parsing
    df["duration_num"] = None

    df_movies = df[df["type"] == "Movie"].copy()
    df_movies["duration_num"] = df_movies["duration"].str.extract(r"(\d+)").astype(float)

    df_shows = df[df["type"] == "TV Show"].copy()
    df_shows["duration_num"] = df_shows["duration"].str.extract(r"(\d+)").astype(float) * 45  # assume avg 45 min per season

    # Merge back
    df = pd.concat([df_movies, df_shows])
    df = df.dropna(subset=["duration_num"])

    # Grouping
    grouped = df.groupby(["listed_in", "rating"]).agg({
        "country": pd.Series.nunique,
        "type": pd.Series.nunique,
        "duration_num": "mean",
        "show_id": "count"
    }).reset_index()

    grouped.columns = ["genre", "rating", "country_count", "type_variety", "avg_duration", "content_count"]
    grouped = grouped[grouped["content_count"] > 20]

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/talent-effect")
def talent_effect():
    df = load_and_clean_data()
    df = df.dropna(subset=["director", "rating"])
    df["rating"] = df["rating"].astype(str).str.upper().str.strip()
    df["director"] = df["director"].astype(str).str.strip()

    # Clean junk
    bad = df["rating"].str.contains("MIN|HR|MOVIE|DOCUMENTARY|SEASON", case=False, na=False)
    df = df[~bad]

    # Explode if multiple directors
    df["director"] = df["director"].str.split(", ")
    df = df.explode("director")

    # Filter directors with enough content
    counts = df["director"].value_counts()
    df = df[df["director"].isin(counts[counts >= 5].index)]

    # Group
    grouped = df.groupby("director").agg({
        "rating": pd.Series.nunique,
        "show_id": "count",
    }).reset_index()

    grouped.columns = ["director", "rating_diversity", "content_count"]
    grouped = grouped.sort_values(by="content_count", ascending=False)

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/content-lifecycle-roi")
def content_lifecycle_roi():
    df = load_and_clean_data()
    df = df.dropna(subset=["release_year", "date_added", "type", "rating"])

    # Fix rating junk
    df["rating"] = df["rating"].astype(str).str.upper().str.strip()
    bad_ratings = df["rating"].str.contains("MIN|HR|MOVIE|DOCUMENTARY|SEASON", case=False, na=False)
    df = df[~bad_ratings]

    # Parse date_added properly
    df["date_added"] = pd.to_datetime(df["date_added"], errors="coerce")
    df = df.dropna(subset=["date_added"])

    # Compute acquisition lag
    df["acquisition_lag"] = df["date_added"].dt.year - df["release_year"]
    df = df[df["acquisition_lag"] >= 0]

    # Group by type and rating
    grouped = df.groupby(["type", "rating"]).agg({
        "acquisition_lag": "mean",
        "show_id": "count"
    }).reset_index()

    grouped.columns = ["type", "rating", "avg_acquisition_lag", "count"]
    grouped = grouped[grouped["count"] > 10]

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/region-content-authority")
def region_content_authority():
    df = load_and_clean_data()
    df = df.dropna(subset=["country", "rating"])

    df["rating"] = df["rating"].astype(str).str.upper().str.strip()
    bad_ratings = df["rating"].str.contains("MIN|HR|SEASON|MOVIE", case=False, na=False)
    df = df[~bad_ratings]

    # Explode multi-country rows
    df["country"] = df["country"].str.split(", ")
    df = df.explode("country")

    top_countries = df["country"].value_counts().head(12).index.tolist()
    df = df[df["country"].isin(top_countries)]

    pivot = pd.pivot_table(
        df,
        index="country",
        columns="rating",
        values="show_id",
        aggfunc="count",
        fill_value=0
    ).reset_index()

    return jsonify(pivot.to_dict(orient="records"))


@app.route("/api/content-gap-arbitrage")
def content_gap_arbitrage():
    df = load_and_clean_data()
    df = df.dropna(subset=["country", "listed_in", "rating"])

    # Clean rating
    df["rating"] = df["rating"].str.upper().str.strip()
    bad_ratings = df["rating"].str.contains("MIN|SEASON|HR|MOVIE|DOCUMENTARY", na=False)
    df = df[~bad_ratings]

    # Explode multi-values
    df["country"] = df["country"].str.split(", ")
    df["listed_in"] = df["listed_in"].str.split(", ")
    df = df.explode("country").explode("listed_in")

    # Clean whitespace
    df["country"] = df["country"].str.strip()
    df["listed_in"] = df["listed_in"].str.strip()

    # Keep top 10 countries only (for usability)
    top_countries = df["country"].value_counts().head(10).index.tolist()
    df = df[df["country"].isin(top_countries)]

    grouped = df.groupby(["country", "listed_in", "rating"]).agg({
        "show_id": "count"
    }).reset_index()

    grouped.columns = ["country", "genre", "rating", "content_count"]
    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/genre-trend")
def genre_trend():
    df = load_and_clean_data()
    df = df.dropna(subset=["release_year", "listed_in"])
    
    df["release_year"] = df["release_year"].astype(int)
    df = df[df["release_year"] >= 2000]

    df["listed_in"] = df["listed_in"].str.split(", ")
    df = df.explode("listed_in")
    df["listed_in"] = df["listed_in"].str.strip()

    top_genres = df["listed_in"].value_counts().head(6).index.tolist()
    df = df[df["listed_in"].isin(top_genres)]

    grouped = df.groupby(["release_year", "listed_in"]).agg({
        "show_id": "count"
    }).reset_index()

    grouped.columns = ["release_year", "genre", "content_count"]
    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/rating-trend")
def rating_trend():
    df = load_and_clean_data()
    df = df.dropna(subset=["release_year", "rating"])

    df["release_year"] = df["release_year"].astype(int)
    df = df[df["release_year"] >= 2000]

    df["rating"] = df["rating"].str.upper().str.strip()
    bad_ratings = df["rating"].str.contains("MIN|SEASON|HR|MOVIE|DOCUMENTARY", na=False)
    df = df[~bad_ratings]

    top_ratings = df["rating"].value_counts().head(6).index.tolist()
    df = df[df["rating"].isin(top_ratings)]

    grouped = df.groupby(["release_year", "rating"]).agg({
        "show_id": "count"
    }).reset_index()

    grouped.columns = ["release_year", "rating", "content_count"]
    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/country-trend")
def country_trend():
    df = load_and_clean_data()
    df = df.dropna(subset=["release_year", "country"])

    df["release_year"] = df["release_year"].astype(int)
    df = df[df["release_year"] >= 2000]

    df["country"] = df["country"].str.split(", ")
    df = df.explode("country")
    df["country"] = df["country"].str.strip()

    top_countries = df["country"].value_counts().head(6).index.tolist()
    df = df[df["country"].isin(top_countries)]

    grouped = df.groupby(["release_year", "country"]).agg({
        "show_id": "count"
    }).reset_index()

    grouped.columns = ["release_year", "country", "content_count"]
    return jsonify(grouped.to_dict(orient="records"))



if __name__ == "__main__":
    app.run(debug=True)
