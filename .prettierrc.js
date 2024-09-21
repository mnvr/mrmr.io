module.exports = {
    tabWidth: 4,
    plugins: ["prettier-plugin-organize-imports"],
    overrides: [
        {
            files: ["*.html"],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
