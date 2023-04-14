import { seedGroups } from "../../../lib/seedLib";

export default async function handler(req, res) {
    try {
        const result = await seedGroups();
        return res.status(200).json(result);
    } catch (error) {   
        console.log(error)
        return res.status(200).json({ message: "error seeding" });
    }
}
