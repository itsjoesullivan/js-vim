/*global module:false*/
module.exports = function(grunt) {
    
    
var files = [
    	'lib/jquery.js',
	'lib/underscore.js',
	'lib/backbone.js',
	'lib/json2html.js',
	'vim/util.js',
	'vim/commands.js',
	'vim/cursor.js',
	'vim/char.js',
	'vim/line.js',
	'vim/doc.js',
	'vim/vim.js',
        'vim/plugins-core/idle.js',
        'vim/plugins-core/insert.js',
	'vim/plugins-core/search.js',
	'vim/plugins-core/visual.js',
        'vim/plugins-core/default.js',
        'vim/init.js',
	];
        
    var test = [
      'lib/mocha.js'
    ];
    
    files = test.concat(files);

  // Project configuration.
  grunt.initConfig({
    concat: {
      dist: {
        src: files,
        dest: 'vim.js'
      }
    },
    watch: {
        files: files,
        tasks: 'default'
      }
  });

  // Default task.
  grunt.registerTask('default', 'concat');
  
  

};
