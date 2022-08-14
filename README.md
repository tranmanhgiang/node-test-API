<!-- ## Jivescribe API
---

#### Install dependencies
   - Run command `npm install` to install all package

#### Create Database

   - Make sure docker was installed on local machine. 

   - To initial database for development, open terminal inside project and then execute the commands below:
   ```bash
      cd /database
      docker-compose up
   ```
   
#### Create environment file

   - Create development .env file from .env.example. 
   ```bash
      cp .env.example .env
   ```

#### Create migration file
   ```bash
      npm run migration:generate {file-name}
   ```
   - New migration file will be created with format name `unix.timestamp-{file-name}.js` in src/migrations folder

#### Running Migrations

   - In the root project run command line `npm run db:migrate`

#### To run the project for development run:
   ```bash
      npm run dev
   ```
 -->
