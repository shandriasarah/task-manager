export function exportData({ tasks, categories }) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    categories,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tarefas-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== "object") {
          throw new Error("Arquivo inválido");
        }
        const tasks = Array.isArray(data.tasks) ? data.tasks : [];
        const categories = Array.isArray(data.categories)
          ? data.categories
          : null;
        resolve({ tasks, categories });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
    reader.readAsText(file);
  });
}
