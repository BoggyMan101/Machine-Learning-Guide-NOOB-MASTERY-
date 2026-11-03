import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

df = pd.read_csv("netflix_titles.csv")


"""#basic plot
plt.figure()
x = np.array([1111, 1222, 1333, 1444, 1555, 1666, 1777])
y = np.array([15, 15, 12, 16, 17, 18, 19])
x2 = np.array([1112, 1222, 1333, 1444, 1555, 1666, 1777])
y2 = np.array([12, 14, 16, 17, 19, 10, 15])



plt.title("class size", fontsize = 20, family="Arial")
plt.xlabel("Year")
plt.ylabel("Students")
plt.tick_params(axis = "both", color = "red")
plt.grid()

linestyle = dict( marker = "o", 
         markersize = 20, 
         markerfacecolor = "black", 
         markeredgecolor = "black", 
         linestyle = "dashed",
         linewidth = 4,
         color = "red")

plt.plot(x, y, **linestyle)
plt.plot(x, y2, **linestyle)

plt.figure()
categories = np.array(["earth", "sun", "moon", "mercury", "venus"])
values = np.array([2, 3, 4, 5, 6])

plt.bar(categories, values)


plt.figure()
categories2 = ["freshman", "sophomores", "juniors", "seniors"]
value2 = [300, 250, 275, 225]
colors = ["red", "yellow", "blue", "green"]

plt.title("Brocode College")
plt.pie(value2, labels = categories2,
        autopct = "%1.1f%%")

plt.figure()

x = [0, 1, 1, 2, 3, 4, 5, 6, 7, 7]
y = [55, 60, 65, 62, 68, 70, 75, 78, 82, 85]

plt.scatter(x, y)


figures, axes = plt.subplots(2,2)

axes[0,0].plot(x, y, y2)

plt.figure()
"""

movies = df[df["type"] == "Movie"].copy()

movies["duration_min"] = movies["duration"].str.extract(r"(\d+)").astype(float)
movies = movies.dropna(subset = ("release_year", "duration_min"))

print(movies["director"])
yearly_avg = movies.groupby("release_year")["duration_min"].mean()

plt.plot(yearly_avg.index, yearly_avg.values)
plt.show()
