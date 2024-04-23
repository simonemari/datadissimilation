import pandas as pd
import os
from sqlalchemy import create_engine, text

# Configurazione dell'allacciamento al database
username = 'postgres'
password = '0774'
hostname = 'localhost'
port = '5432'  # Porta predefinita di PostgreSQL
database_name = 'ScholarData'

# Stringa di connessione al database
connection_string = f'postgresql://{username}:{password}@{hostname}:{port}/{database_name}'

# Creazione del motore SQLAlchemy
engine = create_engine(connection_string)

# Nome della tabella nel database
table_name = 'articles'

directory_path = '/Users/simon/Desktop/NOS'

# Leggiamo tutti i file CSV e concateniamo i DataFrame
dfs = []
for file in os.listdir(directory_path):
    if file.endswith('.csv'):
        df = pd.read_csv(os.path.join(directory_path, file))
        dfs.append(df)

# Creiamo un unico DataFrame
df = pd.concat(dfs, ignore_index=True)

# Numero totale di record prima delle operazioni di filtro
print("Numero totale di record prima delle operazioni di filtro:", len(df))



# Eliminiamo le righe con 'year' nulla e 'cites' inferiore a 5
df = df.dropna(subset=['Year', 'Cites'])
df = df[df['Cites'] >= 5]

# Aggiungi una nuova colonna 'id' come indice seriale
df.reset_index(inplace=True)
df.rename(columns={'index': 'id'}, inplace=True)

# Modifica i nomi delle colonne per essere tutti in minuscolo
df.columns = [col.lower() for col in df.columns]

# Numero totale di record dopo le operazioni di filtro
print("Numero totale di record dopo le operazioni di filtro:", len(df))

# Carichiamo i dati nel database Postgres
with engine.connect() as connection:
    df.to_sql(table_name, connection, if_exists='replace', index=False)

# Contiamo il numero di record nel database
count_query = text(f"SELECT COUNT(*) FROM {table_name}")
with engine.connect() as connection:
    record_count = connection.execute(count_query).fetchone()[0]
print("Numero totale di record nel database:", record_count)