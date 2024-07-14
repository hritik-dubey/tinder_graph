'use server'
import {driver} from "@/db";
import {NEO4JUSER} from "@/types";


export const getUserBYID = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (u: User {applicationId: $applicationId}) RETURN u`, {
        applicationId: id
    })
    const user = result.records.map((record) => record.get('u').properties);
    if (!(user.length)) return null
    console.log("user:", JSON.stringify(user, null, 2));
    return user[0] as NEO4JUSER;
}

export const createUser = async (user: NEO4JUSER) => {
    const {firstName, lastName, email, applicationId} = user
    let createduser = await driver.executeQuery(`CREATE (u:User {applicationId: $applicationId , email: $email ,firstName: $firstName, lastName: $lastName})`, {
        applicationId,
        firstName,
        lastName,
        email
    })
    console.log("createduser:", JSON.stringify(createduser, null, 2));
}
export const getuserWithNoConnection = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (cu: User {applicationId:$applicationId}) MATCH (ou: User) WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou RETURN ou`,
        {
            applicationId: id

        })
    const users = result.records.map((record) => record.get('ou').properties);
    return users as NEO4JUSER
}

export const swipeuser = async (id: string, direction: string, userId: string) => {
    let createdRelationship;
    const type: string = direction === "left" ? "DISLIKE" : "LIKE"
    createdRelationship = await driver.executeQuery(`MATCH (cu: User {applicationId: $id}), (ou: User {applicationId: $userId}) CREATE (cu)-[:${type}]->(ou)`, {
        userId,
        id
    })
    console.log("createdRelationship:", JSON.stringify(createdRelationship, null, 2));
    if(type ==="LIKE") {
        const matchCheck = await driver.executeQuery(`MATCH (cu: User {applicationId: $id}), (ou: User {applicationId: $userId}) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`, {
            userId,
            id
        })
    const match = matchCheck.records.map((record) => record.get('match').properties);
    return Boolean(match.length>0);
    }
}

