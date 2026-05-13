const fs = require('fs');
let b = fs.readFileSync('js/quiz-data.js', 'utf8');
b += `
export function getDomainCareerSet(domainCode) {
  let questionsArr = [];
  let matrix = {};
  let title = "";

  if (domainCode === "SD") {
    questionsArr = SD_QUESTIONS;
    matrix = SD_MATRIX;
    title = "Yazılım Geliştirme Kariyer Testi";
  } else if (domainCode === "DS-AI") {
    questionsArr = DS_AI_QUESTIONS;
    matrix = DS_AI_MATRIX;
    title = "Veri Bilimi ve Yapay Zeka Kariyer Testi";
  } else if (domainCode === "CS-NET") {
    questionsArr = CS_NET_QUESTIONS;
    matrix = CS_NET_MATRIX;
    title = "Siber Güvenlik ve Ağ Kariyer Testi";
  } else if (domainCode === "IS-MT") {
    questionsArr = IS_MT_QUESTIONS;
    matrix = IS_MT_MATRIX;
    title = "Bilişim Sistemleri ve BT Yönetimi Kariyer Testi";
  } else if (domainCode === "CL-DN") {
    questionsArr = CL_DN_QUESTIONS;
    matrix = CL_DN_MATRIX;
    title = "Bulut, Altyapı ve DevOps Kariyer Testi";
  } else {
    return null;
  }

  const dogruCevaplar = {};
  questionsArr.forEach(q => {
    dogruCevaplar[\`Q\${q.id}\`] = q.correctLetter;
  });

  return { title, questions: questionsArr, dogruCevaplar, matrix };
}
`;
fs.writeFileSync('js/quiz-data.js', b);
console.log('done');
