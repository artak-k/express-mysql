require('dotenv').config();

export const config = {
    port: process.env.PORT,
    secret: process.env.SECRET,
    db_url: process.env.DATABASE_URL,
    typeorm_dir: process.env.TYPEORM_DIR
}