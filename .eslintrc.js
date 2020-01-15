module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential'

    ],
    rules: {
        "indent": ["off", 2],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}