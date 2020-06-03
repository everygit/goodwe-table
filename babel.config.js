

var mode = process.env.BUILD_TABLE;

console.log(mode);

module.exports = function(api) {
    api.cache(true);
    if(mode == "PROD") {
        return {
            "presets": [
                ["@babel/preset-env", {
                    "targets": {
                        "chrome": 67
                    }
                }],
                "@vue/babel-preset-jsx"
            ]
        }
    } else {

        return {
            "presets": [
                ["@babel/preset-env", {}],
                "@vue/babel-preset-jsx"
            ]
        }
    }
}