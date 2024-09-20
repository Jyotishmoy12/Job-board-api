const { ResumeParser } = require('resume-parser');

const parseResume = async (resume) => {
  try {
    const parser = new ResumeParser();
    const parsedResume = await parser.parse(resume);
    return parsedResume;
  } catch (error) {
    console.error('Error parsing resume:', error);
    return null;
  }
};

module.exports = parseResume;