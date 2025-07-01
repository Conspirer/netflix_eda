import pandas as pd

def load_and_clean_data():
    df = pd.read_csv("netflix_data.csv")

    # Clean column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

    # Convert date_added to datetime
    df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')

    # Extract year, month
    df['year_added'] = df['date_added'].dt.year
    df['month_added'] = df['date_added'].dt.month

    # Clean duration
    df['duration'] = df['duration'].fillna('0')
    df['duration_int'] = df['duration'].str.extract(r'(\d+)').astype(float)
    df['duration_type'] = df['duration'].str.extract('([a-zA-Z]+)')

    return df
