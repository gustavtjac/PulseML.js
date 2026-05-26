import { getData } from "country-list";

const games = [
    {
        name: "Push-up Game",
        description:
            "How many push-ups can you do in 20 seconds? Your webcam and real-time pose detection count every rep automatically and log your best score.",
    },
    {
        name: "Squat Game",
        description:
            "How many squats can you hit in 20 seconds? The ML model tracks your depth through the camera and counts each rep, logging your best to the leaderboard.",
    },
];

export function seedGames(db) {
    const insert = db.prepare(
        "INSERT INTO games (name, description) VALUES (?, ?)",
    );
    games.forEach((game) => insert.run(game.name, game.description));
}

export function seedCountries(db) {
    const countries = getData();

    countries.forEach((country) => {
        db.prepare("INSERT INTO countries (name, code) VALUES (?, ?)").run(
            country.name,
            country.code,
        );
    });
}
