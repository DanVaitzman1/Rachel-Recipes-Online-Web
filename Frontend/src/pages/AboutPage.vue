<template>
  <div class="about-page">
    <h1>About Us</h1>

    <section class="project-summary">
      <h2>Our Project: Rachel's Recipes Website</h2>
      <p>{{ projectDescription }}</p>
    </section>

    <section class="team">
      <h2>Meet Our Development Team</h2>
      <div class="team-member" v-for="member in teamMembers" :key="member.name">
        <img :src="member.image" :alt="member.name" class="team-member-image" />
        <h3>{{ member.name }}</h3>
        <p>{{ member.description }}</p>
        <p><a :href="member.pastJobs" target="_blank">My previous site</a></p>
        <ul>
          <li v-for="skill in member.skills" :key="skill">{{ skill }}</li>
        </ul>
      </div>
    </section>

    <section class="contact">
      <h2>Get in Touch</h2>
      <p>{{ contactInfo }}</p>
    </section>
  </div>
</template>

<script>
import GuyImage from '@/assets/Guy.jpeg';
import DanImage from '@/assets/Dan.jpeg';
import YuvalImage from '@/assets/Yuval.jpeg';
export default {
  name: "AboutPage",
  data() {
    return {
      projectDescription: `"Rachel's Recipes Website" is an innovative platform that bridges traditional cuisine with the digital age. We offer a unique experience that combines advanced technology with beloved home flavors. Our project allows users to discover, save, and share family recipes using an intuitive and user-friendly interface. With "Rachel's Recipes Website," we're preserving culinary heritage and bringing it to the next generation.`,
      teamMembers: [
        {
          name: "Guy Biton",
          description:
            "A Software and Information Systems Engineering student at Ben-Gurion University of the Negev, specializing in Cybersecurity and Information Security.",
          skills: [
            "Java",
            "C",
            "C#",
            "Data Structures",
            "Cybersecurity",
            "Information Security Analysis",
          ],
          image:GuyImage,
          pastJobs: "https://wed-2023.github.io/207577875/",
        },
        {
          name: "Dan Vaitzman",
          description:
            "A third-year Information Systems Engineering student at Ben-Gurion University, passionate about software development and innovative technologies.",
          skills: [
            "Algorithms",
            "Data Structures",
            "Object-Oriented Programming (OOP)",
            "Java",
            "SQL",
          ],
          image:DanImage,
          pastJobs: "https://wed-2023.github.io/318940913/",
        },
        {
          name: "Yuval Schwartz",
          description:
            "A highly motivated third-year Software and Information Systems Engineering student at Ben-Gurion University, with hands-on experience in Full Stack development. Graduated from a comprehensive coding bootcamp covering the MERN stack.",
          skills: [
            "Python",
            "Object-Oriented Programming (OOP)",
            "Java",
            "JavaScript",
            "Node.js",
            "Full Stack Development",
          ],
          image:YuvalImage,
          pastJobs: "https://wed-2023.github.io/209384783/",
        },
      ],
      contactInfo:
        "For questions, suggestions, or collaborations, please reach out to us through our LinkedIn profiles or via the contact form on this website.",
    };
  },
};
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1,
h2,
h3 {
  color: #2c3e50;
}

h1 {
  border-bottom: 2px solid #2f2626;
  padding-bottom: 10px;
}

.project-summary,
.team,
.contact {
  margin-bottom: 30px;
}

.team-member {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.team-member-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  display: inline-block;
  background-color: #e0e0e0;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 15px;
}
</style>
