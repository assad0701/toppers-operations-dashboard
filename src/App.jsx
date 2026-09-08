import { useEffect, useState } from "react";
import "./App.css";

const defaultInventory = [
  {
    id: 1,
    name: "Classic Pizza",
    category: "Food",
    stock: 25,
    price: 12.99,
  },
  {
    id: 2,
    name: "Toppers Stix",
    category: "Food",
    stock: 8,
    price: 4.99,
  },
  {
    id: 3,
    name: "Mello Yello",
    category: "Beverage",
    stock: 40,
    price: 2.99,
  },
];

const defaultStaff = [
  {
    id: 1,
    name: "Ahmad Assad",
    role: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Hamza Assad",
    role: "Cashier",
    status: "Active",
  },
  {
    id: 3,
    name: "Khamis Assad",
    role: "Kitchen Staff",
    status: "Inactive",
  },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem("toppers-inventory");

    return savedInventory
      ? JSON.parse(savedInventory)
      : defaultInventory;
  });

  const [staff, setStaff] = useState(() => {
    const savedStaff = localStorage.getItem("toppers-staff");

    return savedStaff ? JSON.parse(savedStaff) : defaultStaff;
  });

  const [inventoryForm, setInventoryForm] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
  });

  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "",
    status: "Active",
  });

  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "toppers-inventory",
      JSON.stringify(inventory)
    );
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("toppers-staff", JSON.stringify(staff));
  }, [staff]);

  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (total, item) => total + Number(item.stock),
    0
  );

  const lowStockItems = inventory.filter(
    (item) => Number(item.stock) < 10
  ).length;

  const inventoryValue = inventory.reduce(
    (total, item) =>
      total + Number(item.stock) * Number(item.price),
    0
  );

  function handleInventoryChange(event) {
    const { name, value } = event.target;

    setInventoryForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleInventorySubmit(event) {
    event.preventDefault();

    if (
      !inventoryForm.name.trim() ||
      !inventoryForm.category.trim() ||
      inventoryForm.stock === "" ||
      inventoryForm.price === ""
    ) {
      alert("Please complete all inventory fields.");
      return;
    }

    if (Number(inventoryForm.stock) < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    if (Number(inventoryForm.price) < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (editingInventoryId !== null) {
      setInventory((previousInventory) =>
        previousInventory.map((item) =>
          item.id === editingInventoryId
            ? {
                ...item,
                name: inventoryForm.name.trim(),
                category: inventoryForm.category.trim(),
                stock: Number(inventoryForm.stock),
                price: Number(inventoryForm.price),
              }
            : item
        )
      );

      setEditingInventoryId(null);
    } else {
      const newItem = {
        id: Date.now(),
        name: inventoryForm.name.trim(),
        category: inventoryForm.category.trim(),
        stock: Number(inventoryForm.stock),
        price: Number(inventoryForm.price),
      };

      setInventory((previousInventory) => [
        ...previousInventory,
        newItem,
      ]);
    }

    resetInventoryForm();
  }

  function editInventory(item) {
    setInventoryForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      price: item.price,
    });

    setEditingInventoryId(item.id);
    setActivePage("inventory");
  }

  function deleteInventory(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmed) {
      return;
    }

    setInventory((previousInventory) =>
      previousInventory.filter((item) => item.id !== id)
    );
  }

  function resetInventoryForm() {
    setInventoryForm({
      name: "",
      category: "",
      stock: "",
      price: "",
    });

    setEditingInventoryId(null);
  }

  function handleStaffChange(event) {
    const { name, value } = event.target;

    setStaffForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleStaffSubmit(event) {
    event.preventDefault();

    if (!staffForm.name.trim() || !staffForm.role.trim()) {
      alert("Please complete the staff fields.");
      return;
    }

    if (editingStaffId !== null) {
      setStaff((previousStaff) =>
        previousStaff.map((member) =>
          member.id === editingStaffId
            ? {
                ...member,
                name: staffForm.name.trim(),
                role: staffForm.role.trim(),
                status: staffForm.status,
              }
            : member
        )
      );

      setEditingStaffId(null);
    } else {
      const newStaffMember = {
        id: Date.now(),
        name: staffForm.name.trim(),
        role: staffForm.role.trim(),
        status: staffForm.status,
      };

      setStaff((previousStaff) => [
        ...previousStaff,
        newStaffMember,
      ]);
    }

    resetStaffForm();
  }

  function editStaff(member) {
    setStaffForm({
      name: member.name,
      role: member.role,
      status: member.status,
    });

    setEditingStaffId(member.id);
    setActivePage("staff");
  }

  function deleteStaff(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmed) {
      return;
    }

    setStaff((previousStaff) =>
      previousStaff.filter((member) => member.id !== id)
    );
  }

  function resetStaffForm() {
    setStaffForm({
      name: "",
      role: "",
      status: "Active",
    });

    setEditingStaffId(null);
  }

  function renderDashboard() {
    return (
      <section className="page-section">
        <div className="page-header">
          <div>
            <h1>Operations Dashboard</h1>
            <p>Monitor your business performance and daily operations.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div>
              <p>Total Products</p>
              <h2>{totalProducts}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <div>
              <p>Total Stock</p>
              <h2>{totalStock}</h2>
            </div>
          </div>

          <div className="stat-card warning-card">
            <span className="stat-icon">⚠️</span>
            <div>
              <p>Low Stock Items</p>
              <h2>{lowStockItems}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div>
              <p>Inventory Value</p>
              <h2>${inventoryValue.toFixed(2)}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Inventory</h2>
              <button
                className="text-button"
                onClick={() => setActivePage("inventory")}
              >
                View All
              </button>
            </div>

            {inventory.length === 0 ? (
              <p className="empty-message">No inventory items available.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.slice(0, 5).map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>
                          <span
                            className={
                              Number(item.stock) < 10
                                ? "stock low"
                                : "stock"
                            }
                          >
                            {item.stock}
                          </span>
                        </td>
                        <td>${Number(item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="content-card">
            <div className="card-header">
              <h2>Staff Overview</h2>
              <button
                className="text-button"
                onClick={() => setActivePage("staff")}
              >
                Manage Staff
              </button>
            </div>

            <div className="staff-summary">
              <div>
                <strong>{staff.length}</strong>
                <span>Total Staff</span>
              </div>

              <div>
                <strong>
                  {staff.filter(
                    (member) => member.status === "Active"
                  ).length}
                </strong>
                <span>Active Staff</span>
              </div>

              <div>
                <strong>
                  {staff.filter(
                    (member) => member.status === "Inactive"
                  ).length}
                </strong>
                <span>Inactive Staff</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderInventory() {
    return (
      <section className="page-section">
        <div className="page-header">
          <div>
            <h1>Inventory Management</h1>
            <p>Add, update, and monitor your inventory items.</p>
          </div>
        </div>

        <div className="content-card form-card">
          <h2>
            {editingInventoryId !== null
              ? "Edit Inventory Item"
              : "Add Inventory Item"}
          </h2>

          <form onSubmit={handleInventorySubmit} className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={inventoryForm.name}
              onChange={handleInventoryChange}
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={inventoryForm.category}
              onChange={handleInventoryChange}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock quantity"
              min="0"
              value={inventoryForm.stock}
              onChange={handleInventoryChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              min="0"
              step="0.01"
              value={inventoryForm.price}
              onChange={handleInventoryChange}
            />

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingInventoryId !== null ? "Update Item" : "Add Item"}
              </button>

              {editingInventoryId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetInventoryForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>Inventory Items</h2>
            <span>{inventory.length} products</span>
          </div>

          {inventory.length === 0 ? (
            <p className="empty-message">No inventory items found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Total Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>
                        <span
                          className={
                            Number(item.stock) < 10
                              ? "stock low"
                              : "stock"
                          }
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>
                        $
                        {(
                          Number(item.stock) * Number(item.price)
                        ).toFixed(2)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => editInventory(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => deleteInventory(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderStaff() {
    return (
      <section className="page-section">
        <div className="page-header">
          <div>
            <h1>Staff Management</h1>
            <p>Manage your employees and their current status.</p>
          </div>
        </div>

        <div className="content-card form-card">
          <h2>
            {editingStaffId !== null
              ? "Edit Staff Member"
              : "Add Staff Member"}
          </h2>

          <form onSubmit={handleStaffSubmit} className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Staff name"
              value={staffForm.name}
              onChange={handleStaffChange}
            />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={staffForm.role}
              onChange={handleStaffChange}
            />

            <select
              name="status"
              value={staffForm.status}
              onChange={handleStaffChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingStaffId !== null
                  ? "Update Staff"
                  : "Add Staff"}
              </button>

              {editingStaffId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetStaffForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>Staff Members</h2>
            <span>{staff.length} members</span>
          </div>

          {staff.length === 0 ? (
            <p className="empty-message">No staff members found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>
                        <span
                          className={
                            member.status === "Active"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {member.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => editStaff(member)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => deleteStaff(member.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderPage() {
    if (activePage === "inventory") {
      return renderInventory();
    }

    if (activePage === "staff") {
      return renderStaff();
    }

    return renderDashboard();
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">T</div>
          <div>
            <h2>Toppers</h2>
            <span>Operations</span>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "inventory"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("inventory")}
          >
            <span>📦</span>
            Inventory
          </button>

          <button
            className={
              activePage === "staff"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("staff")}
          >
            <span>👥</span>
            Staff
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>Operations Dashboard</p>
          <small>React Portfolio Project</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>Welcome back</span>
          <span className="date-label">
            {new Date().toLocaleDateString()}
          </span>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;
