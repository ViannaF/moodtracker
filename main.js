document.addEventListener("DOMContentLoaded", () => {
  const buttonsContainer = document.querySelector("#question-container");
  const moodList = document.querySelector("#mood-history-list");
  const streakContainer = document.querySelector("#streak");
  let dateArray = [];

  loadMoodHistory();

  function displayTooltip(mood, target) {
    removeTooltip();
    const moodColors = {
      Happy: { background: "yellow", color: "black" },
      Sad: { background: "navy", color: "white" },
      Calm: { background: "green", color: "white" },
      Energetic: { background: "orange", color: "white" },
      Angry: { background: "red", color: "white" },
      Anxious: { background: "dimgrey", color: "white" },
    };
    const span = document.createElement("span");
    span.textContent = mood;
    span.className = "tooltip";
    document.body.appendChild(span);
    const tooltip = document.querySelector(".tooltip");
    const rect = target.getBoundingClientRect();
    span.style.left = `${
      rect.left +
      window.pageXOffset +
      target.offsetWidth / 2 -
      span.offsetWidth / 2
    }px`;
    span.style.top = `${
      rect.top + window.pageYOffset - span.offsetHeight - 5
    }px`;

    const color = moodColors[mood];
    if (color) {
      tooltip.style.backgroundColor = color.background;
      tooltip.style.color = color.color;
    }
  }

  function removeTooltip() {
    const tooltip = document.querySelector(".tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }

  function addMoodHistory(mood) {
    const moodItem = document.createElement("li");
    moodItem.classList.add("mood-item");
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    dateArray.push(now);
    calculateStreak(dateArray);

    const moodEntry = document.createElement("span");
    moodEntry.textContent = `${mood} `;
    const dateEntry = document.createElement("span");
    dateEntry.textContent = `${date}`;
    const timeEntry = document.createElement("span");
    timeEntry.textContent = ` ${time}`;
    moodItem.appendChild(moodEntry);
    moodItem.appendChild(dateEntry);
    moodItem.appendChild(timeEntry);
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.textContent = "Delete entry";
    moodItem.appendChild(deleteBtn);
    moodList.insertBefore(moodItem, moodList.firstChild);

    deleteBtn.addEventListener("click", (event) => {
      const moodItem = event.target.parentElement;
      const confirmDel = confirm("Are you sure you want to delete this entry?");
      if (confirmDel) {
        moodItem.remove();
      }
      saveMoodHistory();
    });
    saveMoodHistory();
  }

  function saveMoodHistory() {
    localStorage.setItem("moodHistory", moodList.innerHTML);
    localStorage.setItem(
      "moodArray",
      JSON.stringify(dateArray.map((date) => date.toISOString()))
    );
  }

  function loadMoodHistory() {
    const savedHistory = localStorage.getItem("moodHistory");
    const reloadDataArray = localStorage.getItem("moodArray");
    if (savedHistory && reloadDataArray) {
      moodList.innerHTML = savedHistory;
      dateArray = JSON.parse(reloadDataArray).map(
        (dateString) => new Date(dateString)
      );
      console.log(dateArray);
      calculateStreak(dateArray);
      const deleteBtns = document.querySelectorAll(".deleteBtn");
      deleteBtns.forEach((button) => {
        button.addEventListener("click", (event) => {
          const moodItem = event.target.parentElement;
          const confirmDel = confirm(
            "Are you sure you want to delete this entry?"
          );
          if (confirmDel) {
            moodItem.remove();
          }
          saveMoodHistory();
        });
      });
    }
  }

  function calculateStreak(dates) {
    if (!dates || dates.length === 0) {
      streakContainer.textContent = `Current Streak: 0 days`;
      console.log("No dates available. Streak is 0.");
      return;
    }

    // Ensure dates are unique and sorted
    const uniqueDates = [...new Set(dates.map((date) => date.toISOString()))]
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a - b);

    console.log("Unique sorted dates:", uniqueDates);

    let streak = 1;
    for (let i = uniqueDates.length - 1; i > 0; i--) {
      const currentDate = uniqueDates[i];
      const previousDate = uniqueDates[i - 1];
      const differenceInTime = currentDate.getTime() - previousDate.getTime();
      const differenceInDays = Math.round(
        differenceInTime / (1000 * 3600 * 24)
      );

      console.log(
        `Current date: ${currentDate}, Previous date: ${previousDate}`
      );
      console.log(`Difference in days: ${differenceInDays}`);

      if (differenceInDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    streakContainer.textContent = `Current Streak: ${streak} days`;
    console.log("Calculated streak:", streak);
  }

  buttonsContainer.addEventListener("mouseover", (event) => {
    if (
      event.target.nodeName !== "BUTTON" ||
      !event.target.classList.contains("mood-button")
    ) {
      return;
    }

    const mood = event.target.id;
    displayTooltip(mood, event.target);
  });

  buttonsContainer.addEventListener("mouseout", (event) => {
    if (
      event.target.nodeName === "BUTTON" &&
      event.target.classList.contains("mood-button")
    ) {
      removeTooltip();
    }
  });

  buttonsContainer.addEventListener("click", (event) => {
    if (
      event.target.nodeName !== "BUTTON" ||
      !event.target.classList.contains("mood-button")
    ) {
      return;
    }
    const mood = event.target.id;
    addMoodHistory(mood);
  });
});
