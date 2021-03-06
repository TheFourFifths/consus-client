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
                        'babelify', 'browserify-node-config'
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
            },
            options: {
                'include css': true
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
            src: ['index.js', 'src/**/*.js', 'src/**/*.jsx']
        },
        mochacli: {
            options: {
                reporter: 'spec'
            },
            unit: {
                files: {
                    src: ['.test/unit/**/*.js']
                }
            },
            functional: {
                files: {
                    src: [
                        '.test/functional/add-item-fault.js',
                        '.test/functional/print-qr.js',
                        '.test/functional/student-lookup.js',
                        '.test/functional/view-models.js',
                        '.test/functional/view-model-and-items.js',
                        '.test/functional/view-students.js',
                        '.test/functional/create-item.js',
                        '.test/functional/item-checkout.js',
                        '.test/functional/item-checkin.js',
                        '.test/functional/model-checkout.js',
                        '.test/functional/model-checkin.js',
                        '.test/functional/admin-override-item-checkout.js',
                        '.test/functional/item-checkin-student-scanned.js',
                        '.test/functional/longterm-checkout.js',
                        '.test/functional/delete-model.js',
                        '.test/functional/delete-item.js',
                        '.test/functional/edit-model-leave-confirmation.js',
                        '.test/functional/edit-model.js'
                    ]
                }
            },
            integration: {
                options: {
                    env: {
                        test: 'integration'
                    }
                },
                files: {
                    src: [
                        '.test/functional/print-qr.js',
                        '.test/functional/student-lookup.js',
                        '.test/functiona/view-models.js',
                        '.test/functional/create-item.js',
                        '.test/functional/item-checkout.js',
                        '.test/functional/item-checkin.js',
                        '.test/functional/admin-override-item-checkout.js',
                        '.test/functional/delete-model.js',
                        '.test/functional/delete-item.js'
                    ]
                }
            }
        },
        clean: {
            coverage: ['coverage/', 'coverage.lcov', '.nyc_output/'],
            dist: ['.dist/'],
            packages: ['Consus-Client-*/', 'Consus-Client-*'],
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
                    icon: 'assets/icons/consus-logo'
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
                    asar: true,
                    icon: 'assets/icons/consus-logo'
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
                    asar: true,
                    icon: 'assets/icons/consus-logo'
                }
            }
        },
        compress: {
            win64_zip: {
                options: {
                    archive: 'Consus-Client-win.zip',
                    mode: 'zip'
                },
                files: [
                    { src: ['Consus-Client-win32-x64/**'], dest: '/' }
                ]
            },
            linux_tgz: {
                options: {
                    archive: 'Consus-Client-linux.tgz',
                    mode: 'tgz'
                },
                files: [
                    { src: ['Consus-Client-linux-x64/**'], dest: '/' }
                ]
            },
            macos_zip: {
                options: {
                    archive: 'Consus-Client-macos.zip',
                    mode: 'zip'
                },
                files: [
                    { src: ['Consus-Client-darwin-x64/**'], dest: '/' }
                ]
            }
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
    grunt.loadNpmTasks('grunt-electron');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('build', ['clean:dist', 'babel:dist', 'browserify:dist', 'stylus', 'copy', 'inline']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli:unit', 'mochacli:functional']);
    grunt.registerTask('test-unit', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli:unit']);
    grunt.registerTask('test-functional', ['lint', 'build', 'clean:test', 'babel:test', 'mochacli:functional']);
    grunt.registerTask('lintless-test', ['build', 'clean:test', 'babel:test', 'mochacli:unit', 'mochacli:functional']);
    grunt.registerTask('integration-test', ['build', 'clean:test', 'babel:test', 'mochacli:integration']);
    grunt.registerTask('package', ['build', 'electron', 'compress']);
};
