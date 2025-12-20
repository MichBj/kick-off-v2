const vars = require('./vars');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// INSTITUTIONS

const seedInstitution = async (data) => {
  let record = await prisma.base_institution.findFirst({
    where: { name: data.name },
  });
  if (!record) record = await prisma.base_institution.create({ data });
  return record;
};

const seedInstitutions = async (ldaps) => {
  const uea = await seedInstitution({
    name: 'Universidad Estatal Amazonica',
    ldapId: ldaps.uea.id,
    logo: '/assets/images/logo.png',
    isologo: '/assets/images/UEA.png',
  });
  return { uea };
};

// CAMPUS

const _seedCampus = async (data) => {
  let record = await prisma.base_campus.findFirst({
    where: { name: data.name },
  });
  if (!record) record = await prisma.base_campus.create({ data });
  return record;
};

const seedCampus = async (institutions) => {
  const ueaPuyo = await _seedCampus({
    name: 'Campus Puyo',
    institutionId: institutions.uea.id,
  });
  return { ueaPuyo };
};

// LDAP

const seedLdap = async (data) => {
  return await prisma.base_ldap.upsert({
    where: { code: data.code },
    update: {},
    create: data,
  });
};

const seedLdaps = async () => {
  const uea = await seedLdap({
    code: 'uea',
    name: 'Universidad Estatal Amazonica',
    protocol: 'ldap',
    hostname: vars.ldap.uea.hostname,
    port: 389,
    domainDc: 'DC=uea,DC=edu,DC=ec',
    baseDn: 'DC=uea,DC=edu,DC=ec',
    username: vars.ldap.uea.username,
    password: vars.ldap.uea.password,
    domain: '@uea.edu.ec',
  });
  return { uea };
};

// LDAP USER VARS

const localUserVarId = async (code) => {
  const record = await prisma.base_localUserVar.findUnique({ where: { code } });
  return record.id;
};

const seedLdapUserVar = async (data) => {
  return await prisma.base_ldapUserVar.upsert({
    where: {
      ldapId_localUserVarId: {
        ldapId: data.ldapId,
        localUserVarId: data.localUserVarId,
      },
    },
    update: {},
    create: data,
  });
};

const seedLdapUserVars = async (ldaps) => {
  const data = [
    // UEA
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('DisName'),
      name: 'displayName',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('name'),
      name: 'name',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('firstN'),
      name: 'givenName',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('lastN'),
      name: 'sn',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('dni'),
      name: 'cedulaPasaporte',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('email'),
      name: 'mail',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('mobile'),
      name: 'mobile',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('accName'),
      name: 'sAMAccountName',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('cDate'),
      name: 'whenCreated',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('lDate'),
      name: 'pwdLastSet',
    },
    {
      ldapId: ldaps.uea.id,
      localUserVarId: await localUserVarId('pemail'),
      name: 'alternateEmailAddresses',
    },
  ];
  data.map(async (item) => await seedLdapUserVar(item));
};

// MAIN

const main = async () => {
  const ldaps = await seedLdaps();
  await seedLdapUserVars(ldaps);
  const institutions = await seedInstitutions(ldaps);
  await seedCampus(institutions);
};

main()
  .catch((_) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
