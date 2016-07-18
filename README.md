#gulp-build
Using Gulp to Build a Front-End Website from Techdegree and Treehouse

##Instructions
Run the `npm install` command to install all of the dependencies for the build process.

Run the `gulp scripts` command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder. Source maps will be generated. Also, all of the project’s JavaScript files will be linted using ESLint and if there’s an error, the error will output to the console and the build process will be halted.

Run the `gulp styles` command at the command line to compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder. Source maps will also be generated.

Run the `gulp images` command at the command line to optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.

Run the `gulp clean` command at the command line to delete all of the files and folders in the dist folder.

Run the `gulp build` command at the command line to run the clean, scripts, styles, and images tasks with confidence that the clean task completes before the other commands.

Run the `gulp` command at the command line to run the “build” task.
