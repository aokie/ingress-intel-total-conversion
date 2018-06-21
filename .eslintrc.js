module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent":   [ "warn", 4, { "SwitchCase": 1 }],
        "quotes":   [ "error", "single"],
        "semi":     [ "error", "always"],
        "no-undef": "off",
        "no-console": "off",
        "eqeqeq":   ["error", "always"],
    }
};
