import os from 'os'

const getHealth = (req, res) => {
  const freeMemory = os.freemem() / 1024 / 1024;
  const cpuCores = os.cpus().length;

  res.status(200).json({
    status: "success",
    message: "The Server is up and running",
    sysInfo: {
      sys: `${os.type()}`,
      host: `${os.hostname()}`,
      freeMem: `${freeMemory.toFixed(2)}`,
      cores: `${cpuCores}`
    }
  })
}

export default getHealth;
