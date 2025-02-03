// prettier-ignore
module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'parser': "@babel/eslint-parser",
    'parserOptions': {
        "sourceType": "module",
        "allowImportExportEverywhere": true,
        "requireConfigFile": false,
        "babelOptions": {
            "presets": ["@babel/preset-react"]
        }
    },
    'plugins': ['react', 'react-hooks'],
    // 'rules': {
    //     'eqeqeq': 'error',
    //     'max-lines': ['warn', 400],
    //     'no-trailing-spaces': 'error',
    //     'no-var': 'error',
    //     "react/no-unescaped-entities": 0,
    //     'react/boolean-prop-naming': 'error',
    //     "react-hooks/rules-of-hooks": "error",
    //     "react-hooks/exhaustive-deps": "warn",
    //     'react/jsx-key': 'error',
    //     'react/prefer-stateless-function': 'error',
    //     'react/prop-types': 'off',
    //     "react/react-in-jsx-scope": "off",
    //     'require-await': 'error',
    // },
    'settings': {
        'react': {
            'version': 'detect'
        }
    }
};