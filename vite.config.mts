// TODO
// import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mrmr = () => {
    return {
        name: "mrmr",

        resolveId(id) {
            console.log(arguments);
            if (id.startsWith("utils/")) {
                return import.meta.dirname + "/src/" + id + ".ts";
            }
        },
    };
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [mrmr()],
    // TODO
    publicDir: "static",
    build: {
        rollupOptions: {
            input: {
                index: import.meta.dirname + "/index.html",
                a: import.meta.dirname + "/a.html",
            },
        },
    },
});
