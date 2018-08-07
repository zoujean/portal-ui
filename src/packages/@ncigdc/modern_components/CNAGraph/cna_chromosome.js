// const dataPoint = {
//   "score": ,
//   "start": number,
//   "end"; number,
//   "chromosome": number,
//   "case": string,
//   "gene": string
// }
const _ = require('lodash');

let chr1genes = Array.from(Array(1961).keys());
let chr2genes = Array.from(Array(1194).keys());
let chr3genes = Array.from(Array(1024).keys());
let chr4genes = Array.from(Array(727).keys());
let chr5genes = Array.from(Array(839).keys());
let chr6genes = Array.from(Array(996).keys());
let chr7genes = Array.from(Array(862).keys());
let chr8genes = Array.from(Array(646).keys());
let chr9genes = Array.from(Array(739).keys());
let chr10genes = Array.from(Array(706).keys());
let chr11genes = Array.from(Array(1224).keys());
let chr12genes = Array.from(Array(988).keys());
let chr13genes = Array.from(Array(308).keys());
let chr14genes = Array.from(Array(583).keys());
let chr15genes = Array.from(Array(561).keys());
let chr16genes = Array.from(Array(795).keys());
let chr17genes = Array.from(Array(1124).keys());
let chr18genes = Array.from(Array(261).keys());
let chr19genes = Array.from(Array(1357).keys());
let chr20genes = Array.from(Array(516).keys());
let chr21genes = Array.from(Array(215).keys());
let chr22genes = Array.from(Array(417).keys());

export const chromosomes = [
  {
    chr: 1,
    genes: 1961,
    geneArray: chr1genes,
    start_position: 0,
    end_position: 1961,
  },
  {
    chr: 2,
    genes: 1194,
    geneArray: chr2genes,
    start_position: 1962,
    end_position: 3155,
  },
  {
    chr: 3,
    genes: 1024,
    geneArray: chr3genes,
    start_position: 3156,
    end_position: 4179,
  },
  {
    chr: 4,
    genes: 727,
    geneArray: chr4genes,
    start_position: 4180,
    end_position: 4906,
  },
  {
    chr: 5,
    genes: 839,
    geneArray: chr5genes,
    start_position: 4907,
    end_position: 5745,
  },
  {
    chr: 6,
    genes: 996,
    geneArray: chr6genes,
    start_position: 5746,
    end_position: 6741,
  },
  {
    chr: 7,
    genes: 862,
    geneArray: chr7genes,
    start_position: 6742,
    end_position: 7603,
  },
  {
    chr: 8,
    genes: 646,
    geneArray: chr8genes,
    start_position: 7604,
    end_position: 8249,
  },
  {
    chr: 9,
    genes: 739,
    geneArray: chr9genes,
    start_position: 8250,
    end_position: 8988,
  },
  {
    chr: 10,
    genes: 706,
    geneArray: chr10genes,
    start_position: 8989,
    end_position: 9694,
  },
  {
    chr: 11,
    genes: 1224,
    geneArray: chr11genes,
    start_position: 9695,
    end_position: 10918,
  },
  {
    chr: 12,
    genes: 988,
    geneArray: chr12genes,
    start_position: 10919,
    end_position: 11906,
  },
  {
    chr: 13,
    genes: 308,
    geneArray: chr13genes,
    start_position: 11907,
    end_position: 12214,
  },
  {
    chr: 14,
    genes: 583,
    geneArray: chr14genes,
    start_position: 12215,
    end_position: 12797,
  },
  {
    chr: 15,
    genes: 561,
    geneArray: chr15genes,
    start_position: 12798,
    end_position: 13358,
  },
  {
    chr: 16,
    genes: 795,
    geneArray: chr16genes,
    start_position: 13359,
    end_position: 14153,
  },
  {
    chr: 17,
    genes: 1124,
    geneArray: chr17genes,
    start_position: 14154,
    end_position: 15277,
  },
  {
    chr: 18,
    genes: 261,
    geneArray: chr18genes,
    start_position: 15278,
    end_position: 15538,
  },
  {
    chr: 19,
    genes: 1357,
    geneArray: chr19genes,
    start_position: 15539,
    end_position: 16895,
  },
  {
    chr: 20,
    genes: 516,
    geneArray: chr20genes,
    start_position: 16896,
    end_position: 17411,
  },
  {
    chr: 21,
    genes: 215,
    geneArray: chr21genes,
    start_position: 17412,
    end_position: 17626,
  },
  {
    chr: 22,
    genes: 417,
    geneArray: chr22genes,
    start_position: 17627,
    end_position: 18043,
  },
];
// a chromosome has genes
// a gene has a start and finish position
// a gene has a cna value
// a cna has a value from -2 to 2
//

const negOrPos = ['positive', 'negative'];

const genScore = () => {
  let whatKind = negOrPos[Math.floor(Math.random() * 2)];
  let score = Math.floor(Math.random() * 2 + Math.round(Math.random()));
  if (whatKind === 'positive' || score === 0) {
    return score;
  } else {
    return score * -1;
  }
};

let cnaScores = [];
let i = 0;
while (i < 18043) {
  let aScore = genScore();
  cnaScores = [...cnaScores, aScore];
  i++;
}

// console.log('scores: ', cnaScores);

// randomly pick a gene
// randomly pick a position in that gene
// assign that position to a score object
// for now, start and end positions will be the same
// randomly generate a list of 50 cases

let cnaPoints = cnaScores.map((score, i) => {
  return {
    score: score,
    start_position: i,
    end_position: i,
    gene: i.toString(),
  };
});
