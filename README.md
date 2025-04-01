IN THIS APPLICATION I USED NODE (v20.15.0) AND NPM (10.7.0)
TAILWIND CSS (V4.0)

In the latest version of Tailwind CSS, modifying the tailwind.config.js file is not required for most typical use cases.

To Install :
           npm install tailwindcss @tailwindcss/cli
In css File :
           @import "tailwindcss"; (add this)
link to output css file :
           <link href="./output.css" rel="stylesheet"> (put it in head )
To Run :

  To Execute Tailwind: 
    run below command in terminal :
      npx @tailwindcss/cli -i ./src/styles.css -o ./src/output.css --watch  

      It will create output.css file in src folder  
    
    Then Execute index.html file in the web browser 

git hub link = https://github.com/prudhvi-marada/weather

this website is live at :
       
https://prudhvi-marada.github.io/weather/
