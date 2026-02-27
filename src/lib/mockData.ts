import { AnalysisResult, AnalysisHistory, FeedbackItem } from './types';

export const sampleDocumentText = `Title: The Impact of Artificial Intelligence on Modern Education Systems

Abstract
This thesis examines the transformative effects of artificial intelligence technologies on contemporary educational frameworks. The research investigates how AI-powered tools are reshaping pedagogical approaches, student engagement, and learning outcomes across various educational institutions. Through a mixed-methods approach combining quantitative surveys and qualitative interviews, this study reveals significant improvements in personalized learning experiences while highlighting critical challenges related to digital equity and teacher preparedness.

Chapter 1: Introduction
1.1 Background
The rapid advancement of artificial intelligence has fundamentally altered numerous sectors, and education is no exception. In recent years, AI-driven platforms have emerged as powerful tools capable of personalizing learning experiences, automating administrative tasks, and providing real-time feedback to students. However, the integration of AI into educational systems raises important questions about accessibility, effectiveness, and ethical implications.

1.2 Problem Statement  
Despite the growing adoption of AI in education, there is a lack of comprehensive understanding regarding its impact on student learning outcomes and teacher effectiveness. Many institutions have adopted AI tools without adequate evaluation of their pedagogical value, leading to inconsistent implementation and mixed results.

1.3 Research Objectives
This study aims to evaluate the effectiveness of AI-powered learning tools in higher education, to identify key challenges in AI integration, and to propose a framework for responsible AI adoption in educational settings.

Chapter 2: Literature Review
2.1 Historical Context
The use of technology in education dates back to the introduction of computers in classrooms during the 1980s (Johnson, 2015). Since then, technological integration has evolved significantly, with each generation of tools bringing new possibilities and challenges.

2.2 AI in Education
Smith (2020) argues that AI has the potential to revolutionize education by enabling personalized learning at scale. Similarly, Brown and Davis (2019) found that AI-powered tutoring systems improved student performance by an average of 15% compared to traditional methods. However, Chen et al. (2021) caution that over-reliance on AI could diminish critical thinking skills.

2.3 Challenges and Concerns
Several researchers have highlighted concerns about AI in education. Williams (2018) emphasizes the digital divide, noting that AI tools may exacerbate existing inequalities. Furthermore, Thompson (2020) found that many teachers feel inadequately prepared to integrate AI into their teaching practices.

Chapter 3: Methodology
3.1 Research Design
This study employs a mixed-methods research design, combining quantitative surveys with qualitative semi-structured interviews. The quantitative component involved a survey of 500 students across five universities.

3.2 Data Collection
Data were collected through online questionnaires distributed via institutional email systems. Semi-structured interviews were conducted with 30 educators who have experience implementing AI tools in their classrooms.

3.3 Data Analysis
Quantitative data were analyzed using SPSS software, employing descriptive statistics and regression analysis. Qualitative data were analyzed through thematic analysis following Braun and Clarke's (2006) six-phase framework.

Chapter 4: Results
4.1 Survey Results
The survey revealed that 78% of students reported positive experiences with AI-powered learning tools. Additionally, 65% of respondents indicated improved understanding of complex topics when using AI-assisted platforms.

4.2 Interview Findings
Thematic analysis of interview data identified four major themes: enhanced personalization, increased engagement, technical barriers, and training needs. Educators consistently emphasized the importance of proper training and institutional support for successful AI integration.

Chapter 5: Discussion
5.1 Interpretation of Results
The findings align with previous research suggesting that AI can enhance learning outcomes when properly implemented. The positive student experiences reported in this study are consistent with the findings of Brown and Davis (2019), who also observed improved performance with AI tools.

5.2 Implications
These results have significant implications for educational policy and practice. Institutions should invest in comprehensive training programs for educators and ensure equitable access to AI tools for all students.

Chapter 6: Conclusion
6.1 Summary
This study has demonstrated that AI technologies hold considerable promise for improving educational outcomes. However, successful implementation requires careful planning, adequate training, and attention to equity considerations.

6.2 Recommendations
Based on the findings, three key recommendations are proposed: develop standardized AI literacy programs for educators, establish guidelines for ethical AI use in education, and create funding mechanisms to ensure equitable access.

References
Braun, V. and Clarke, V. (2006) Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), pp. 77-101.
Brown, A. and Davis, M. (2019) AI-powered tutoring systems in higher education. Journal of Educational Technology, 45(3), pp. 234-251.
Chen, L., Wang, P. and Zhang, H. (2021) Critical thinking in the age of AI. Educational Research Review, 32, pp. 100-115.
Johnson, R. (2015) Technology in the classroom: A historical perspective. Education Today, 28(1), pp. 12-25.
Smith, J. (2020) Artificial intelligence and personalized learning. Modern Education Quarterly, 15(2), pp. 89-106.
Thompson, K. (2020) Teacher preparedness for AI integration. Teaching and Technology, 8(4), pp. 167-182.
Williams, S. (2018) The digital divide in educational technology. Equity in Education, 12(1), pp. 45-63.`;

export const mockAnalysisResult: AnalysisResult = {
  fileName: "AI_Impact_Education_Thesis.pdf",
  summary: "This thesis investigates the impact of artificial intelligence on modern education systems through a mixed-methods approach. The study examines how AI-powered tools reshape pedagogy, student engagement, and learning outcomes. Key findings reveal 78% positive student experiences with AI tools, while highlighting challenges in digital equity and teacher preparedness. The research proposes a framework for responsible AI adoption including standardized AI literacy programs and equitable access guidelines.",
  overallScore: 72,
  scores: {
    structure: 82,
    citations: 68,
    grammar: 74,
    style: 65,
  },
  feedback: {
    structure: [
      {
        id: "s1",
        type: "suggestion",
        title: "Missing Acknowledgements Section",
        description: "The thesis lacks an Acknowledgements section, which is standard in most university thesis formats.",
        reason: "Most universities require an acknowledgements section between the Abstract and Table of Contents. This shows gratitude to supervisors and contributors.",
        location: "Document Structure",
        suggested: "Add an Acknowledgements section after the Abstract acknowledging your supervisor, institution, and any funding sources.",
      },
      {
        id: "s2",
        type: "warning",
        title: "Missing Table of Contents",
        description: "No Table of Contents was detected in the document. This is a required structural element.",
        reason: "A Table of Contents helps readers navigate the thesis and is mandatory in virtually all academic institutions.",
        location: "Document Structure",
      },
      {
        id: "s3",
        type: "issue",
        title: "Chapter 5 Discussion Lacks Summary Paragraph",
        description: "Chapter 5 (Discussion) does not end with a summary or transition paragraph leading into the Conclusion.",
        original: "Institutions should invest in comprehensive training programs for educators and ensure equitable access to AI tools for all students.",
        suggested: "Add a concluding paragraph: 'In summary, the discussion reveals that while AI integration shows promising results, success hinges on institutional support, teacher training, and equitable access. These findings set the stage for the concluding recommendations presented in the next chapter.'",
        reason: "Each chapter should end with a brief summary that transitions to the next chapter, ensuring logical flow.",
        location: "Chapter 5, Section 5.2",
      },
      {
        id: "s4",
        type: "suggestion",
        title: "Missing List of Figures/Tables",
        description: "No List of Figures or Tables section was found. If the thesis contains any figures or tables, this section should be included.",
        reason: "Academic formatting standards require a List of Figures/Tables when visual elements are present.",
        location: "Front Matter",
      },
      {
        id: "s5",
        type: "warning",
        title: "Introduction Lacks Clear Thesis Statement",
        description: "The introduction chapter does not contain a clear, concise thesis statement that encapsulates the main argument.",
        reason: "A strong thesis statement guides the reader and provides focus for the entire document.",
        location: "Chapter 1, Section 1.2",
        suggested: "Add a clear thesis statement such as: 'This thesis argues that AI integration in education significantly improves personalized learning outcomes when accompanied by adequate teacher training and equitable access policies.'",
      },
    ],
    citations: [
      {
        id: "c1",
        type: "issue",
        title: "Inconsistent Citation Format",
        description: "The reference list uses a mix of APA and Harvard formatting styles. Some entries use 'and' while others might use '&'.",
        original: "Braun, V. and Clarke, V. (2006) Using thematic analysis...",
        suggested: "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101.",
        reason: "Consistency in citation style is critical. Choose one format (APA 7th recommended) and apply it uniformly across all references.",
        location: "References Section",
      },
      {
        id: "c2",
        type: "issue",
        title: "Missing Page Numbers for Direct Quote",
        description: "The in-text citation for the direct reference to '15% improvement' does not include a page number.",
        original: "Brown and Davis (2019) found that AI-powered tutoring systems improved student performance by an average of 15%",
        suggested: "Brown and Davis (2019, p. 238) found that AI-powered tutoring systems improved student performance by an average of 15%",
        reason: "When citing specific statistics or findings, APA style requires page numbers to allow readers to verify the claim.",
        location: "Chapter 2, Section 2.2",
      },
      {
        id: "c3",
        type: "warning",
        title: "'Et al.' Usage May Be Premature",
        description: "Chen et al. (2021) is used on first mention. APA 7th requires all authors on first citation if there are only three.",
        original: "Chen et al. (2021) caution that...",
        suggested: "Chen, Wang, and Zhang (2021) caution that... [first mention]; then Chen et al. (2021) for subsequent citations.",
        reason: "APA 7th edition requires listing all authors for the first in-text citation when there are three or fewer authors.",
        location: "Chapter 2, Section 2.2",
      },
      {
        id: "c4",
        type: "suggestion",
        title: "Consider Adding DOIs to References",
        description: "None of the reference entries include DOI numbers, which are recommended for digital traceability.",
        reason: "DOIs provide permanent links to sources and are increasingly required by academic institutions.",
        location: "References Section",
      },
      {
        id: "c5",
        type: "warning",
        title: "Missing Appendix References",
        description: "The document mentions survey data and interview findings but doesn't reference appendices where raw data or instruments might be included.",
        reason: "Supporting data, questionnaires, and interview guides should be referenced and included in appendices.",
        location: "Chapter 3",
      },
    ],
    grammar: [
      {
        id: "g1",
        type: "issue",
        title: "Tense Inconsistency in Results",
        description: "The results section mixes present and past tense when reporting findings.",
        original: "The survey revealed that 78% of students reported positive experiences",
        suggested: "The survey revealed that 78% of students reported positive experiences with AI-powered learning tools.",
        reason: "Results should consistently use past tense as they describe completed research activities.",
        location: "Chapter 4, Section 4.1",
      },
      {
        id: "g2",
        type: "warning",
        title: "Overly Long Sentence",
        description: "A sentence in the Abstract exceeds 40 words, making it difficult to parse.",
        original: "The research investigates how AI-powered tools are reshaping pedagogical approaches, student engagement, and learning outcomes across various educational institutions.",
        suggested: "The research investigates how AI-powered tools reshape pedagogical approaches and student engagement. It also examines learning outcomes across various educational institutions.",
        reason: "Academic writing recommends sentences between 15-25 words for optimal readability.",
        location: "Abstract",
      },
      {
        id: "g3",
        type: "suggestion",
        title: "Passive Voice Overuse",
        description: "Multiple instances of passive voice detected where active voice would improve clarity.",
        original: "Data were collected through online questionnaires distributed via institutional email systems.",
        suggested: "The research team collected data through online questionnaires distributed via institutional email systems.",
        reason: "While passive voice is acceptable in methodology sections, overuse can reduce clarity. Balance both voices.",
        location: "Chapter 3, Section 3.2",
      },
      {
        id: "g4",
        type: "issue",
        title: "Vague Opening Phrase",
        description: "A paragraph opens with 'Several researchers have highlighted...' which is vague and lacks specificity.",
        original: "Several researchers have highlighted concerns about AI in education.",
        suggested: "Multiple empirical studies have identified significant concerns regarding AI integration in educational settings.",
        reason: "Avoid vague opening phrases. Be specific about who and what you're referencing.",
        location: "Chapter 2, Section 2.3",
      },
    ],
    style: [
      {
        id: "st1",
        type: "warning",
        title: "Informal Language Detected",
        description: "The phrase 'is no exception' is somewhat informal for academic writing.",
        original: "education is no exception",
        suggested: "education has similarly been transformed",
        reason: "Academic writing requires formal, precise language throughout.",
        location: "Chapter 1, Section 1.1",
      },
      {
        id: "st2",
        type: "issue",
        title: "Unsupported Claim",
        description: "The statement about 'rapid advancement' lacks a supporting citation.",
        original: "The rapid advancement of artificial intelligence has fundamentally altered numerous sectors",
        suggested: "The rapid advancement of artificial intelligence has fundamentally altered numerous sectors (Russell & Norvig, 2021; McKinsey Global Institute, 2023)",
        reason: "Every factual claim in academic writing must be supported by a citation. Unsupported claims weaken credibility.",
        location: "Chapter 1, Section 1.1",
      },
      {
        id: "st3",
        type: "suggestion",
        title: "Repetitive Terminology",
        description: "The word 'significant' appears 4 times across different sections without variation.",
        suggested: "Vary with: substantial, considerable, noteworthy, meaningful",
        reason: "Repetitive vocabulary suggests limited academic vocabulary and can bore the reader.",
        location: "Multiple sections",
      },
      {
        id: "st4",
        type: "warning",
        title: "Weak Analytical Depth",
        description: "The Discussion chapter largely summarizes findings rather than critically analyzing them.",
        reason: "The discussion should compare findings with existing literature, identify contradictions, and explore implications deeply—not merely restate results.",
        location: "Chapter 5",
        suggested: "Expand the discussion to critically compare your findings with Chen et al. (2021) who found contrary results regarding AI's impact on critical thinking skills.",
      },
      {
        id: "st5",
        type: "suggestion",
        title: "Consider Adding Research Limitations",
        description: "No limitations section was found. Acknowledging limitations strengthens academic credibility.",
        reason: "Discussing limitations shows critical self-awareness and helps readers contextualize findings appropriately.",
        location: "Chapter 5 or Chapter 6",
        suggested: "Add a section: '5.3 Limitations — This study is limited by its sample size of 500 students from only five universities, which may not be representative of all higher education contexts.'",
      },
    ],
  },
  documentText: sampleDocumentText,
};

export const mockHistory: AnalysisHistory[] = [
  {
    id: "1",
    fileName: "AI_Impact_Education_Thesis.pdf",
    date: "2026-02-25",
    overallScore: 72,
    scores: { structure: 82, citations: 68, grammar: 74, style: 65 },
  },
  {
    id: "2",
    fileName: "Machine_Learning_Healthcare.docx",
    date: "2026-02-20",
    overallScore: 85,
    scores: { structure: 90, citations: 82, grammar: 88, style: 80 },
  },
  {
    id: "3",
    fileName: "Climate_Change_Policy_Review.pdf",
    date: "2026-02-15",
    overallScore: 61,
    scores: { structure: 70, citations: 55, grammar: 65, style: 54 },
  },
];
