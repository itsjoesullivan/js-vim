

define(function () {
    //Do setup work here

    return function() {

        
        vim.exec('escape');

	describe('cursor', function() {
		it('won\'t barf when it hits an empty line', function() {
			var err = false;
			try {
			var doc = new Doc();
			vim.open(doc);
			} catch(e) {
				err = true;
			}
			expect(err).to.be.false;
		});
	});

        describe('idle', function() {
            
            beforeEach(function(done){
                var doc = new Doc();
		console.log(doc);
                vim.open(doc);
		console.log(vim);
                done();
            });
            
            describe('a', function() {
                it('sets you up to write text on the character after where the cursor is', function() {
                    expect(vim.get('mode')).equal('idle');
                    vim.exec(['i','a','s','d','f','escape','h','h','a','g','escape']);
                    expect(vim.get('doc').get('lines').at(0).toText()).equal('asdgf');
                });
            });
            describe('i', function() {
                it('switches to insert mode', function() {
                    expect(vim.get('mode')).equal('idle');
                    vim.exec('i');
                    expect(vim.get('mode')).equal('insert');
                    vim.exec('escape');
                    expect(vim.get('mode')).equal('idle');
                });
            });
            
            describe('x', function() {
                it('removes the character underneath it', function() {
                    vim.exec(['i','q','escape']);
                    expect(vim.get('doc').toText()).equal('q');
                    vim.exec(['h','x']);
                    expect(vim.get('doc').toText()).equal('');
                });
            });
            
            
            describe('h', function() {
                //moves cursor left
                it('moves the cursor left', function() {
                    expect(cursor.line || cursor.char).equal(0);
                    vim.exec(['i','a','s','d','f','escape']);
                    var char = cursor.char;
                    vim.exec(['h','h']);
                    var curChar = cursor.char;
                    expect(curChar+2).equal(char);
                });
                //if theres no text, doesnt do anything
                //if beginning of line and theres a line above, moves to the end of that line
            });
            describe('j', function() {
                //moves cursor down
                it('moves the cursor down', function() {
                    vim.exec(['i','a','\r','b','escape','k']);
                    expect(cursor.line).equal(0);
                    vim.exec('j');
                    expect(cursor.line).equal(1);
                });
                //if down, does nothing
            });
            describe('k', function() {
                //moves cursor up
                it('moves the cursor up', function() {
                    vim.exec(['i','h','\r','a','escape']);
                    expect(cursor.line).equal(1);
                    vim.exec('k');
                    expect(cursor.line).equal(0);
                });
                //if first line, does nothing
            });
            describe('l', function() {
                //moves cursor right
                it('moves the cursor right', function() {
                    vim.exec(['i','a','s','d','f','escape']);
                    
                    vim.exec(['h','h']);
                    var char = cursor.char;
                    vim.exec(['l']);
                    expect(cursor.char-1).equal(char);
                });
                //if end of line, moves to next line
                //if no next line, does nothing
            });
            describe('0', function() {
                //moves cursor to beginning of line
                it('moves cursor to beginning of line', function() {
                    vim.exec(['i','a','s','d','f','escape']);
                    expect(cursor.char).not.equal(0);
                    vim.exec('0');
                    expect(cursor.char).equal(0);
                });
            });
            describe('$', function() {
                //moves cursor to end of line
                it('moves cursor to end of line', function() {
                    vim.exec(['i','a','s','d','f','escape']);
                    expect(cursor.char).not.equal(0);
                    vim.exec('0');
                    expect(cursor.char).equal(0);
                    vim.exec('$');
                    expect(cursor.char).equal(4);
                });
            });
            
            describe('o', function() {
                //creates a line below, moves to it, and goes into insert mode
                it('creates a line below, moves to it, and goes into insert mode', function() {
                    vim.exec(['i','a','escape','o']);
                    expect(doc.toText()).equal('a\n');
                    expect(vim.get('mode')).equal('insert');
                });
            });
            describe('O', function() {
                //creates a line above, moves to it and goes insert mode
                it('creates a line above, moves to it and goes insert mode', function() {
                    vim.exec(['i','a','\r','b','escape','O','c']);
                    expect(doc.toText()).equal('a\nc\nb');
                    expect(vim.get('mode')).equal('insert');
                });
            });

            describe('dd', function() {
                it('deletes the current line', function() {
                    clipboard._val = false;
                   vim.exec(['i','a','s','d','f','\r','a','s','d','escape']);
                   expect(doc.toText()).equal('asdf\nasd');
                   vim.exec(['d','d']);
                   expect(doc.toText()).equal('asdf');
                   expect(clipboard._val).equal('asd');
                });
            });
	    describe('yy', function() {
		    it('copies the current line', function() {
			    clipboard._val = false;
                   		vim.exec(['i','a','s','d','f','\r','a','s','d','escape']);
				expect(doc.toText()).equal('asdf\nasd');
				vim.exec(['y','y']);
				expect(doc.toText()).equal('asdf\nasd');
				expect(clipboard._val).equal('asd');
		    });
	    });

	    describe('2y', function() {
		it('copies two lines', function() {
			    clipboard._val = false;
                   		vim.exec(['i','a','s','d','f','\r','a','s','d','f','\r','h','i','escape']);
//				expect(doc.toText()).equal('asdf\nasdf\nhi');
				vim.exec('k');
				vim.exec(['2','y']);
				expect(clipboard._val).equal('asdf\nhi');
		});
	    });
        });
        
    }
});

