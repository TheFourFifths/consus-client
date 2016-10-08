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
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            uses_defaults: [
                'src/**/*.js',
                'test/**/*.js'
            ]
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
        },
        electron: {
            win64Build: {
                options: {
                    name: 'Consus-Client',
                    dir: '.',
                    out: '.',
                    version: '1.4.2',
                    platform: 'win32',
                    arch: 'x64',
                    prune: true,
                    overwrite: true,
                    asar: true,
                    icon: 'consus-logo.ico' //This isn't working?
                }
            },
            macosBuild: {
                options: {
                    name: 'Consus-Client',
                    dir: '.',
                    out: '.',
                    version: '1.4.2',
                    platform: 'darwin',
                    arch: 'x64',
                    prune: true,
                    overwrite: true,
                    asar: true
                }
            },
            linuxBuild: {
                options: {
                    name: 'Consus-Client',
                    dir: '.',
                    out: '.',
                    version: '1.4.2',
                    platform: 'linux',
                    arch: 'x64',
                    prune: true,
                    overwrite: true,
                    asar: true
                }
            }            
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-electron');

    grunt.registerTask('build', ['clean:dist', 'babel:dist', 'browserify:dist', 'stylus', 'copy', 'inline']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli']);
    grunt.registerTask('package', ['build', 'electron']);
};
