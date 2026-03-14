type SearchableItem = {
  id: string;
  type: "project" | "research" | "innovation";
  title: string;
  summary: string;
  tags: string[];
};

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

export function scoreItems(query: string, items: SearchableItem[]) {
  const qTokens = tokenize(query);
  const qSet = new Set(qTokens);

  return items
    .map((item) => {
      const text = `${item.title} ${item.summary} ${item.tags.join(" ")}`;
      const tokens = tokenize(text);
      let score = 0;

      for (const t of tokens) {
        if (qSet.has(t)) score += 2;
      }

      for (const tag of item.tags) {
        const lowerTag = tag.toLowerCase();
        if (query.toLowerCase().includes(lowerTag)) score += 3;
      }

      if (query.toLowerCase().includes(item.type)) score += 1;

      return { ...item, score };
    })
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
}
