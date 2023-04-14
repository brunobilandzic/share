import { seedReservations, test } from "../../../lib/seedLib";

export default async function handler(req, res) {
     try {
        const result = await seedReservations();
        return res.status(200).json(result);
    } catch (error) {   
        console.log(error)
        return res.status(200).json({ message: "error seeding" });
    }
}