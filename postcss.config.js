// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = () => ({
    plugins: [
        require('postcss-import')({
            path: ['resources/assets/']
        }),
        require('postcss-assets')({
            loadPaths: ['resources/assets/common/']
        }),
        require('postcss-nested'),
        require('postcss-color-function'),
        require('postcss-mixins'),
        require('postcss-extend'),
        require('postcss-units')({
            size: 75,
            fallback: false,
            precision: 4
        }),
        require('postcss-cssnext')({
            warnForDuplicates: false,
            browsers: ['> 1%', 'ie > 8', 'android 4', 'iOS 6']
        }),
        require('cssnano')({
            sourcemap: true,
            safe: true,
            discardComments: {
                removeAll: true,
            },
            discardUnused: false,
            zindex: false
        })
    ]
});
