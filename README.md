# Server
Server Files

# Building and Running

`npm install`

`cp config.example.js config.js` Copy the example config, edit if needed

`node index.js`


# API Docs

Default Base: `localhost:3000/api`

All request bodies must be JSON

### `GET /v1/me`

Returns details on the logged in user, returns not authorized if not logged in

### `POST /v1/users`

Creates a new user with the following JSON parameters

- `username` - Username of the user
- `password` - Password of the user
- `email` - Optional - Email of the user

### `GET /v1/users/:user`

Returns summary details of the user

### `POST /v1/auth`

Logs in the user with the given credentials

- `username` - Username of the user
- `password` - Password of the user

### `PUT /v1/auth/logout`

Logs out the user if logged in

### `POST /v1/communities`

Creates a new community

- `name` - Name of the community
- `title` - Title of the community
- `description` - Optional - Description of the community
- `sidebar` - Optional - Sidebar text of the community
- `nsfw` - Optional - Bool - Whether the community is NSFW

### `GET /v1/communities?sort=<top|new>&count=<10>&offset=<0>`

Retrieves the list of communities given the sorting criteria

Example: `/v1/communities?sort=top&count=10&offset=10`

### `GET /v1/communities/:community`

Retrieves details for the given community

Example: `/v1/communities/bitconnect`

### `PUT /v1/communitites/:community/favourite`

Favourites the given community, returns an error if already favourited

### `DELETE /v1/communities/:community/favourite`

Deletes a community favourite if it is favourited

### `GET /v1/communities/:community/templates?sort=top|new&offset=0&count=10`

Retrieves list of templates that have been used in the given community sorted by the parameters

`top` templates are sorted by the amount of memes using that template in the community

### `POST /v1/memes`

Creates new meme

- `title` - Optional - Title of the meme
- `link` - Image link of the meme
- `width` - Width of the meme (100 <= width <= 6000)
- `height` - Height of the meme (100 <= height <= 6000)
- `templateId` - Template ID of the meme
- `communityName` - Community name of the meme

### `GET /v1/memes?sort=top|new&offset=0&count=10`

WIP - Gets list of memes across all communities

### `GET /v1/memes/:id`

Retrieves details on the given meme

### `DELETE /v1/memes/:id`

Deletes the meme if they are the creator

### `PUT /v1/memes/:id/vote`

Votes for a meme

- `vote` - The vote for the meme, either 1 or -1

### `DELETE /v1/memes/:id/vote`

Deletes a vote for a meme

### `GET /v1/memes/:id/comments`

Get all comments for a meme (given as id and text pairs)

### `POST /v1/memes/:id/comments`

Comment on a meme

- `text` - The comment for the meme (string of length 1-1000)

### `DELETE /v1/memes/:id/comments/:commentid`

Delete a comment on a meme

### `POST /v1/templates`

Creates new template

- `title` - Optional - Title of the template
- `previewLink` - Image link of the template
- `previewWidth` - Width of the preview image (100 <= width <= 6000)
- `previewHeight` - Height of the preview image (100 <= height <= 6000)
- `serialized` - JSON defining the serialized state of the canvas

### `DELETE /v1/templates/:id`

Deletes the given template if the user owns it and no meme is using it

### `GET /v1/templates/:id`

Retrieves details on the template, including the serialized data

### `GET /v1/templates?sort=top|new&offset=0&count=10`

Retrieves list of templates sorted by the parameters

`top` templates are sorted by the amount of memes using that template

Example: `/v1/templates?sort=top&count=10&offset=10`

### `GET /v1/search/:query/autocomplete`

Returns autocomplete search results for the given query

Example: `/v1/search/bitconnect/autocomplete` will return search results for bitconnect

