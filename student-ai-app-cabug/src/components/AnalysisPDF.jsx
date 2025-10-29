// src/components/AnalysisPDF.jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textDecoration: "underline",
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 2,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
});

export default function AnalysisPDF({ result = {}, subjectName = "" }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          AI Analysis Report - {subjectName || "N/A"}
        </Text>

        <View style={styles.section}>
          <Text style={styles.header}>AI Summary:</Text>
          <Text>{result.analysis || "No summary provided."}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>
            Passed Students ({result.passedStudents?.length || 0}):
          </Text>
          {result.passedStudents?.length ? (
            result.passedStudents.map((s, i) => (
              <Text key={i} style={styles.listItem}>
                • {s}
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>None</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>
            Failed Students ({result.failedStudents?.length || 0}):
          </Text>
          {result.failedStudents?.length ? (
            result.failedStudents.map((s, i) => (
              <Text key={i} style={styles.listItem}>
                • {s}
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>None</Text>
          )}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleString()}
        </Text>
      </Page>
    </Document>
  );
}
