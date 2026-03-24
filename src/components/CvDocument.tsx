import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { experience } from "../data/experience";
import { skills } from "../data/skills";
import type { Lang } from "../hooks/useLanguage";
import { en } from "../i18n/en";
import { es } from "../i18n/es";

const ACCENT = "#e066b2";
const DARK = "#111827";
const MUTED = "#6b7280";
const SIDEBAR_BG = "#f9f8ff";
const BORDER = "#e5e7eb";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    lineHeight: 1.4,
    flexDirection: "column",
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.3,
    color: DARK,
  },
  nameAccent: {
    color: ACCENT,
  },
  role: {
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: MUTED,
    marginTop: 20,
  },
  headerContact: {
    alignItems: "flex-end",
    gap: 3,
  },
  headerContactItem: {
    fontSize: 8,
    color: MUTED,
    textDecoration: "none",
  },

  // ── Body columns ────────────────────────────────────────
  body: {
    flexDirection: "row",
    flex: 1,
  },

  // ── Left sidebar ────────────────────────────────────────
  leftCol: {
    width: 168,
    backgroundColor: SIDEBAR_BG,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },

  // ── Right column ────────────────────────────────────────
  rightCol: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 36,
    paddingTop: 20,
    paddingBottom: 24,
  },

  // ── Shared section ──────────────────────────────────────
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: ACCENT,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  // ── Skills ──────────────────────────────────────────────
  skillCategory: {
    marginBottom: 7,
  },
  skillCategoryName: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  skillList: {
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.5,
  },

  // ── Education (sidebar) ─────────────────────────────────
  eduEntry: {
    marginBottom: 6,
  },
  eduTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 1,
  },
  eduOrg: {
    fontSize: 7.5,
    color: MUTED,
    marginBottom: 1,
  },
  eduPeriod: {
    fontSize: 7.5,
    color: MUTED,
  },

  // ── About ───────────────────────────────────────────────
  bio: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 3,
  },

  // ── Experience ──────────────────────────────────────────
  entry: {
    marginBottom: 11,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    flex: 1,
    color: DARK,
  },
  entryPeriod: {
    fontSize: 7.5,
    color: MUTED,
    textAlign: "right",
  },
  entryOrg: {
    fontSize: 8,
    color: ACCENT,
    marginBottom: 2,
  },
  entryDesc: {
    fontSize: 8,
    color: "#4b5563",
    lineHeight: 1.55,
  },
});

const skillGroups: { label: string; category: string }[] = [
  { label: "Frontend", category: "frontend" },
  { label: "Backend", category: "backend" },
  { label: "3D & Creative", category: "3d" },
  { label: "Tools", category: "tools" },
];

interface Props {
  lang: Lang;
}

export function CvDocument({ lang }: Props) {
  const t = lang === "es" ? es : en;
  const l = (field: { es: string; en: string }) => field[lang];

  const workEntries = experience.filter((e) => e.type === "work");
  const eduEntries = experience.filter((e) => e.type === "education");

  return (
    <Document title="Juan Manuel Lambre — CV" author="Juan Manuel Lambre">
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>
              {"Juan Manuel "}
              <Text style={styles.nameAccent}>Lambre</Text>
            </Text>
            <Text style={styles.role}>{t.hero.role}</Text>
          </View>
          <View style={styles.headerContact}>
            <Text style={styles.headerContactItem}>juanmlambre@gmail.com</Text>
            <Link src="https://juanmalambre.github.io" style={styles.headerContactItem}>
              juanmalambre.github.io
            </Link>
            <Link src="https://github.com/juanmalambre" style={styles.headerContactItem}>
              github.com/juanmalambre
            </Link>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {/* ── Left sidebar ── */}
          <View style={styles.leftCol}>
            {/* Skills */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.skills.title}</Text>
              {skillGroups.map(({ label, category }) => {
                const names = skills
                  .filter((s) => s.category === category)
                  .map((s) => s.name)
                  .join(", ");
                return (
                  <View key={category} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryName}>{label}</Text>
                    <Text style={styles.skillList}>{names}</Text>
                  </View>
                );
              })}
            </View>

            {/* Education */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{lang === "es" ? "Educación" : "Education"}</Text>
              {eduEntries.map((entry) => (
                <View key={entry.id} style={styles.eduEntry}>
                  <Text style={styles.eduTitle}>{l(entry.title)}</Text>
                  <Text style={styles.eduOrg}>{entry.org}</Text>
                  <Text style={styles.eduPeriod}>{l(entry.period)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Right column ── */}
          <View style={styles.rightCol}>
            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.about.title}</Text>
              {t.about.bio.map((line, i) => (
                <Text key={i} style={styles.bio}>
                  {line}
                </Text>
              ))}
            </View>

            {/* Experience */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.experience.title}</Text>
              {workEntries.map((entry) => (
                <View key={entry.id} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{l(entry.title)}</Text>
                    <Text style={styles.entryPeriod}>{l(entry.period)}</Text>
                  </View>
                  <Text style={styles.entryOrg}>{entry.org}</Text>
                  <Text style={styles.entryDesc}>{l(entry.description)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
