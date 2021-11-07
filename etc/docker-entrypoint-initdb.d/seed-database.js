db.createUser(
    {
        user : 'choonio-user',
        pwd  : 'synthwavethebestwave',
        roles: [
            {
                role: 'readWrite',
                db  : 'choonio'
            }
        ],
        mechanisms: [
            "SCRAM-SHA-1",
            "SCRAM-SHA-256"
        ]
    }
)

db = db.getSiblingDB('choonio')
