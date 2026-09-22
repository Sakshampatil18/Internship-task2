import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [issues, setIssues] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Accessibility");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // Get all issues
  useEffect(() => {
    fetch("http://localhost:5000/api/issues")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load issues");
        }

        return response.json();
      })
      .then((data) => {
        setIssues(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to connect to the backend server.");
        setLoading(false);
      });
  }, []);

  // Add or update issue
  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === "" || description.trim() === "") {
      setError("Please enter both a title and description.");
      return;
    }

    setError("");

    const issueData = {
      title: title.trim(),
      category,
      priority,
      description: description.trim(),
    };

    // Update issue
    if (editingId !== null) {
      fetch(`http://localhost:5000/api/issues/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update issue");
          }

          return response.json();
        })
        .then((updatedIssue) => {
          setIssues(
            issues.map((issue) =>
              issue.id === editingId ? updatedIssue : issue,
            ),
          );

          resetForm();
        })
        .catch((error) => {
          console.error(error);
          setError("Unable to update the issue.");
        });

      return;
    }

    // Create issue
    fetch("http://localhost:5000/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issueData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add issue");
        }

        return response.json();
      })
      .then((newIssue) => {
        setIssues([...issues, newIssue]);
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to add the issue.");
      });
  };

  // Edit issue
  const editIssue = (issue) => {
    setEditingId(issue.id);
    setTitle(issue.title);
    setCategory(issue.category);
    setPriority(issue.priority);
    setDescription(issue.description);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete issue
  const deleteIssue = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this issue?",
    );

    if (!confirmed) {
      return;
    }

    setError("");

    fetch(`http://localhost:5000/api/issues/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete issue");
        }

        return response.json();
      })
      .then(() => {
        setIssues(issues.filter((issue) => issue.id !== id));
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to delete the issue.");
      });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Accessibility");
    setPriority("Medium");
    setDescription("");
    setError("");
  };

  // Filter issues

  // Dashboard statistics
  const totalIssues = issues.length;

  const highPriorityIssues = issues.filter(
    (issue) => issue.priority === "High",
  ).length;

  const mediumPriorityIssues = issues.filter(
    (issue) => issue.priority === "Medium",
  ).length;

  const lowPriorityIssues = issues.filter(
    (issue) => issue.priority === "Low",
  ).length;

  const accessibilityIssues = issues.filter(
    (issue) => issue.category === "Accessibility",
  ).length;
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || issue.category === filterCategory;

    const matchesPriority =
      filterPriority === "All" || issue.priority === filterPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterPriority("All");
  };

  return (
    <div className="container">
      <h1>Accessibility Issue Tracker</h1>
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Issues</h3>
          <p>{totalIssues}</p>
        </div>

        <div className="stat-card">
          <h3>High Priority</h3>
          <p>{highPriorityIssues}</p>
        </div>

        <div className="stat-card">
          <h3>Medium Priority</h3>
          <p>{mediumPriorityIssues}</p>
        </div>

        <div className="stat-card">
          <h3>Low Priority</h3>
          <p>{lowPriorityIssues}</p>
        </div>

        <div className="stat-card">
          <h3>Accessibility</h3>
          <p>{accessibilityIssues}</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Issue Form */}
      <form className="issue-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Issue Title</label>

        <input
          id="title"
          type="text"
          placeholder="Enter issue title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="category">Category</label>

        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>Accessibility</option>
          <option>Performance</option>
          <option>Best Practices</option>
          <option>SEO</option>
          <option>Architecture</option>
        </select>

        <label htmlFor="priority">Priority</label>

        <select
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          placeholder="Describe the issue"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit">
          {editingId !== null ? "Update Issue" : "Add Issue"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {/* Search and Filters */}
      <div className="filters">
        <h2>Search & Filter Issues</h2>

        <input
          type="text"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(event) => setFilterCategory(event.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Accessibility">Accessibility</option>
          <option value="Performance">Performance</option>
          <option value="Best Practices">Best Practices</option>
          <option value="SEO">SEO</option>
          <option value="Architecture">Architecture</option>
        </select>

        <select
          value={filterPriority}
          onChange={(event) => setFilterPriority(event.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Issues */}
      {loading ? (
        <p>Loading issues...</p>
      ) : filteredIssues.length === 0 ? (
        <p>No matching issues found.</p>
      ) : (
        <div className="issue-grid">
          {filteredIssues.map((issue) => (
            <div className="issue-card" key={issue.id}>
              <h2>{issue.title}</h2>

              <p>
                <strong>Category:</strong> {issue.category}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                <span
                  className={`priority-badge ${issue.priority.toLowerCase()}`}
                >
                  {issue.priority}
                </span>
              </p>

              <p>{issue.description}</p>

              <button onClick={() => editIssue(issue)}>Edit</button>

              <button
                className="delete-button"
                onClick={() => deleteIssue(issue.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
