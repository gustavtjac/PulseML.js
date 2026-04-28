import { getData } from "country-list";



export function seedCountries(db) {
    const countries = getData();
    
    countries.forEach(country => {
        db.prepare(
            "INSERT INTO countries (name, code) VALUES (?, ?)",
        ).run(country.name, country.code);
    });
};



