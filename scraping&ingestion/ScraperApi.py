import requests
from bs4 import BeautifulSoup

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
        proxies = {
          "https": "scraperapi.output_format=json.autoparse=true.wait_for_selector=a:ffa4752b9dfab823ea428de8c2f410a5@proxy-server.scraperapi.com:8001"
        }

        r = requests.get(related_url, proxies=proxies, verify=False)

        # Parse the response with BeautifulSoup
        soup = BeautifulSoup(r.text, 'html.parser')

        # Find all <a> tags that start with 'Cited by'
        cited_by_links = soup.find_all(lambda tag: tag.name == 'a' and tag.text.startswith('Cited by'))

        # If there are links that start with 'Cited by'
        if cited_by_links:
            # Select the first link
            first_link = cited_by_links[0]

            # Print the content of the first link
            print(first_link.text)

            # Get the number that follows 'Cited by' and save it in a variable
            number_after_cited_by = first_link.text.split(' ')[2]
            print(number_after_cited_by)
            # Updating the record in the database with the second cursor
            cur2.execute("UPDATE articles SET cites = %s WHERE id = %s", (number_after_cited_by, id))
            print(f"Record with id {id} updated successfully.")
        else:
            print("There are no links that start with 'Cited by'")
else:
    print("No rows returned by the query.")

# Committing changes to the database
conn.commit()

# Closing cursors and connection
cur.close()
cur2.close()
conn.close()