Build cmds
-----------
- available as npm scripts
- tsc -w => compiles src and test => Watches them => js under build folder
- use npm run test:watch => In an another terminal when tsc -w is running = > incremental test execution
- use npm run watch:bundle => In an another terminal, when tsc -w is running => Incremental bundling for the browser.
- use npm run server => Launches a lite server on port 8000
- Build folder contains compiled *.js files for both src && test folder.
- public/js contains the bundled output for the browser.
- npm run clean => cleans build folder and the bundle under public/js

Notes
-------------

- Load dataset
- Dataset 
    - Find trade dates
    - Find expiries , expiries/trade-dates
    - Get info by symbol
- Postions
    - Add option to position
    - Analyze performance of position
        
		
		BS.call(new BSHolder(8907,8950,0.07,0.12,(2/365)))
		
		7% means 0.07
		12% means 0.12