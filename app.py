from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:0774@localhost/ScholarData'
db = SQLAlchemy(app)

@app.route('/')
def datatables():
    # Creiamo un motore SQLAlchemy con la stringa di connessione al tuo database
    engine = create_engine('postgresql://postgres:0774@localhost/ScholarData')

    # Eseguiamo una query per ottenere tutti i record dal database
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, cites, authors, title FROM articles"))
        records = [dict(row._mapping) for row in result]

    # Passiamo i record alla nostra pagina HTML
    return render_template('datatables.html', records=records)

@app.route('/d3')
def d3():
    # Creiamo un motore SQLAlchemy con la stringa di connessione al tuo database
    engine = create_engine('postgresql://postgres:0774@localhost/ScholarData')

    # Eseguiamo una query per ottenere tutti i record dal database
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM articles"))
        records = [dict(row._mapping) for row in result]

    # Passiamo i record alla nostra pagina HTML
    return render_template('d3.html', records=records)

if __name__ == '__main__':
    app.run(debug=True)