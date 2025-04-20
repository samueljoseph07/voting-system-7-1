const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const FormDataModel = require("./models/FormData");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://josephsamuel1236:CJwyrSH8lXdZtlw9@blockchainvotingdatabas.rf1jx.mongodb.net/?retryWrites=true&w=majority&appName=BlockchainVotingDatabase"
);

// Helper function to calculate Euclidean distance between face descriptors
const calculateFaceDistance = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return Infinity;
  }
  
  return Math.sqrt(
    descriptor1.reduce((sum, val, i) => sum + Math.pow(val - descriptor2[i], 2), 0)
  );
};

app.post("/register", (req, res) => {
  const { email, password, faceData } = req.body;
  
  if (!faceData || !faceData.descriptor) {
    return res.status(400).json({ error: "Face data is required for registration" });
  }

  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      res.json("Already registered");
    } else {
      FormDataModel.create(req.body)
        .then((log_reg_form) => res.json(log_reg_form))
        .catch((err) => res.json(err));
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({ success: true, message: "Credentials verified" });
      } else {
        res.json({ success: false, message: "Wrong password" });
      }
    } else {
      res.json({ success: false, message: "No records found!" });
    }
  });
});

app.post("/verify-face", async (req, res) => {
  const { email, faceData } = req.body;

  if (!faceData || !faceData.descriptor) {
    return res.status(400).json({ 
      success: false, 
      message: "Face data is required for verification" 
    });
  }

  try {
    const user = await FormDataModel.findOne({ email: email });
    
    if (!user || !user.faceData || !user.faceData.descriptor) {
      return res.json({ 
        success: false, 
        message: "No face data found for this user" 
      });
    }

    const distance = calculateFaceDistance(
      faceData.descriptor,
      user.faceData.descriptor
    );

    // Threshold for face match (lower means stricter matching)
    const threshold = 0.6;

    if (distance < threshold) {
      res.json({ 
        success: true, 
        message: "Face verification successful" 
      });
    } else {
      res.json({ 
        success: false, 
        message: "Face verification failed" 
      });
    }
  } catch (error) {
    console.error("Face verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred during face verification" 
    });
  }
});

app.listen(3001, () => {
  console.log("Server listining on http://127.0.0.1:3001");
});
