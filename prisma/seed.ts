import bcrypt from 'bcrypt';
import prisma from '../src/db/prisma.client';

const main = async () => {
    const hashedPassword = await bcrypt.hash('pivPap-ryqse5-sipjir', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'bruno-d-34@hotmail.fr' },
        update: {},
        create: {
            email: 'bruno-d-34@hotmail.fr',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin créé :', admin.email);
}

main()
    .catch(console.error)
    .finally(() => process.exit(0));