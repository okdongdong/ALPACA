# MongoDB

### Documents

#### problem

```json
{
    "_id": ObjectId,
    "problemNumber": Int64,
    "level": Int64,
    "title": String,
    "inputs": Array(String),
    "outputs": Array(String),
    "classLevel": Int64
}
```

### today_problem

```json
{
    "_id": ObjectId,
    "userId": Int64,
    "problemRecommendRes": Array(Object) [
        {
            "problemNumber": Int64,
            "title": String,
            "level": Int64,
            "classLevel": Int64,
            "isSolved": Boolean
        }
    ],           
    "date": Date
}
```

### Code

```json
{
    "_id": ObjectId,
    "userId": Int64,
    "problemNumber": Int64,
    "language": String,
    "submittedAt": Date,
    "submittedCode": String
}
```

### Chat

```json
{
    "_id": ObjectId,
    "userId": Int64,
    "studyId": Int64,
    "timeStamp": Date,
    "content": String
}
```

### Notification

```json
{
    "_id": ObjectId,
    "userId": Int64,
    "roomMaker": String,
    "roomMakerProfileImg": String,
    "studyId": Int64,
    "studyTitle": String,
    "scheduleId": Int64,
    "scheduleStartedAt": Date,
    "isInvitation": Boolean
}
```

