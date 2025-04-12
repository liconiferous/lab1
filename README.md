# Recipe Management Application

This is a recipe management application built with Express and MongoDB, allowing users to add, edit, delete, and view dish information.

## Challenges Encountered

MongoDB Connection Issues

**Challenges**:
- Incorrect credential configuration in connection string
- Security settings issues in MongoDB Atlas


**Solutions**:
- Ensure correct `CONNECTION_URL` setting in the `.env` file, replacing `<db_password>` with the actual password
- Configure IP whitelist in MongoDB Atlas console
- Check MongoDB Atlas user permission settings



