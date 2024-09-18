import PractitionerSeeder from "./practitioner-seeder.js";
import PegawaiSeeder from "./pegawai-seeder.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import LokasiSeeder from "./lokasi-seeder.js";

export const dbSeeder = async () => {
    const transaction = await sequelizeInstance.transaction();
    try {
        await PegawaiSeeder.seed(transaction);
        await PractitionerSeeder.seed(transaction);
        await LokasiSeeder.seed(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};