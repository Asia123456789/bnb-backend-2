Test user login and id
{
  "email": "linda@hotmail.com",
  "password": "linda123"
}
cc34f16c-81f9-4c13-8959-1dd7aea2b09e

Admin
Admin kan ta bort alla properties som inte har några bokningar.
Om propertyn har minst en bokning, så blockerar databasen borttagningen p.g.a. foreign key-constrainten bookings_property_id_fkey. Det är Postgres sätt att skydda dataintegriteten.