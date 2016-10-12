'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: '.dist/'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/',
                        src: ['**/*.js'],
                        dest: '.test/'
                    }
                ]
            }
        },
        copy: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*.html',
                            '**/*.css'
                        ],
                        dest: '.dist/'
                    }
                ]
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify']
                    ]
                },
                files: {
                    '.dist/bundle.js': 'src/views/main.jsx'
                }
            }
        },
        stylus: {
            compile: {
                files: {
                    '.dist/bundle.css': 'src/styles/main.styl'
                }
            }
        },
        inline: {
            dist: {
                options: {
                    tag: ''
                },
                src: '.dist/index.html',
                dest: '.dist/index.html'
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc.json'
            },
            src: ['index.js', 'src/**/*.js']
        },
        mochacli: {
            options: {
                reporter: 'spec'
            },
            unit: {
                files: {
                    src: ['.test/unit/**/*.js']
                }
            }
        },
        clean: {
            dist: ['.dist/'],
            test: ['.test/']
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.registerTask('build', ['clean:dist', 'babel:dist', 'browserify:dist', 'stylus', 'copy', 'inline']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli']);

};
