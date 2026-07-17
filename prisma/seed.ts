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

    await prisma.skill.createMany({
        data: [
            // Fonctionnel
            { label: 'Back-office métier', type: 'FUNCTIONAL', order: 1 },
            { label: 'SaaS', type: 'FUNCTIONAL', order: 2 },
            { label: 'E-learning', type: 'FUNCTIONAL', order: 3 },
            { label: 'Édition médicale', type: 'FUNCTIONAL', order: 4 },
            { label: 'Immobilier', type: 'FUNCTIONAL', order: 5 },
            { label: 'Temps réel', type: 'FUNCTIONAL', order: 6 },
            { label: 'Mobile', type: 'FUNCTIONAL', order: 7 },

            // Technique
            { label: 'Angular', type: 'TECHNICAL', order: 1 },
            { label: 'Ionic', type: 'TECHNICAL', order: 2 },
            { label: 'Node.js', type: 'TECHNICAL', order: 3 },
            { label: 'Express', type: 'TECHNICAL', order: 4 },
            { label: 'MongoDB', type: 'TECHNICAL', order: 5 },
            { label: 'PostgreSQL', type: 'TECHNICAL', order: 6 },
            { label: 'Google Maps', type: 'TECHNICAL', order: 8 },

            // Architecture
            { label: 'From scratch', type: 'ARCHITECTURE', order: 1 },
            { label: 'Multi-tenant', type: 'ARCHITECTURE', order: 2 },
            { label: 'API REST', type: 'ARCHITECTURE', order: 3 },
            { label: 'Architecture modulaire', type: 'ARCHITECTURE', order: 4 },
            { label: 'Composants réutilisables', type: 'ARCHITECTURE', order: 5 },
            { label: 'SCSS', type: 'ARCHITECTURE', order: 6 },
            { label: 'Design System', type: 'ARCHITECTURE', order: 7 },
            { label: 'Clean Code', type: 'ARCHITECTURE', order: 8 },
            { label: 'SOLID', type: 'ARCHITECTURE', order: 9 },
            { label: 'KISS / DRY', type: 'ARCHITECTURE', order: 10 },

            // Soft skills
            { label: 'Autonomie', type: 'SOFT_SKILL', order: 1 },
            { label: 'Force de proposition', type: 'SOFT_SKILL', order: 2 },
            { label: 'Conception fonctionnelle', type: 'SOFT_SKILL', order: 3 },
            { label: 'Collaboration', type: 'SOFT_SKILL', order: 4 },
            { label: 'Travail en équipe réduite', type: 'SOFT_SKILL', order: 5 },
            { label: 'Maintenance évolutive', type: 'SOFT_SKILL', order: 6 },
        ],
        skipDuplicates: true,
    });
}

main()
    .catch(console.error)
    .finally(() => process.exit(0));