# Function: Extract the number of citations of an article from Google Scholar and update the database
import psycopg2
from serpapi import GoogleSearch

# Database connection
conn = psycopg2.connect(
    dbname="ScholarData",
    user="postgres",
    password="0774",
    host="localhost",
    port="5432"
)

# Creating a cursor
cur = conn.cursor()

# Creating a second cursor
cur2 = conn.cursor()

# Executing a query to get all records
cur.execute("SELECT id, related_url, year from articles")
rows = cur.fetchall()

if rows:
    # Iterating over records
    for record in rows:
        id, related_url, year = record
        actual_query = related_url.split('/')[3][10:]


        # Executing Google search
        params = {
            "api_key": "3c586e3757bb8c5eef82f4ff0a48c48c9a86a1ea356ce788cfbad2bd8d44f1d7",
            "engine": "google_scholar",
            "as_ylo": year,
            "as_yhi": year,
            "q": actual_query,
            "hl": "en",
            "num": 1
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        # Extracting the 'total' value from the 'cited_by' key of the first element of the 'organic_results' list
        cited_by_total = results['organic_results'][0]['inline_links']['cited_by']['total']

        # Updating the record in the database with the second cursor
        cur2.execute("UPDATE articles SET cites = %s WHERE id = %s", (cited_by_total, id))
        print(f"Record with id {id} updated successfully.")
else:
    print("No rows returned by the query.")

# Committing changes to the database
conn.commit()

# Closing cursors and connection
cur.close()
cur2.close()
conn.close()