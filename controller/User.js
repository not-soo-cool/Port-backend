import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../middlewares/sendMail.js";
import cloudinary from "cloudinary";
import fs from "fs"

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true,
        sameSite: "None",
        secure: true
      })
      .json({
        success: true,
        message: "Logged In Successfully",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne().select("-password -email");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // const imgBuffer = fs.readFileSync('C:/Users/91827/OneDrive/Documents/Web Dev/Projects/3D_Resume/frontend/src/images/IMG_6295.png')
    // const imgBase64 = imgBuffer.toString('base64');

    // const attachments = [
    //   {
    //     filename: 'IMG_6294.jpg',
    //     content: imgBuffer,
    //     encoding: 'base64',
    //     cid: 'unique_image_cid', // Unique identifier for the image
    //   }
    // ];

    const userMessage = `
      <p>Hey, I am <b>${name}</b>.</p>
      <p>My email is <b>${email}</b>.</p>
      <p>My message is <b>${message}</b>.</p>
      `;
      // <img src="cid:unique_image_cid" alt="IMG_6294">

    await sendMail({
      email,
      userMessage,
      // attachments
      // {
      //   filename: 'IMG_6295.png',
      //   content: imgBase64,
      //   encoding: 'base64'
      // }
    });

    return res.status(200).json({
      success: true,
      message: "Message Sent Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, email, password, skills, about } = req.body;

    // console.log(skills);

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }

    if (skills) {
      if (skills.image1) {
        // await cloudinary.v2.uploader.destroy(user.skills.image1.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(skills.image1, {
          folder: "portfolio",
        });

        user.skills.image1 = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (skills.image2) {
        // console.log("Image 2 available");
        // await cloudinary.v2.uploader.destroy(user.skills.image2.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(skills.image2, {
          folder: "portfolio",
        });

        console.log(myCloud);

        user.skills.image2 = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (skills.image3) {
        // await cloudinary.v2.uploader.destroy(user.skills.image3.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(skills.image3, {
          folder: "portfolio",
        });

        user.skills.image3 = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (skills.image4) {
        // await cloudinary.v2.uploader.destroy(user.skills.image4.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(skills.image4, {
          folder: "portfolio",
        });

        user.skills.image4 = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (skills.image5) {
        // await cloudinary.v2.uploader.destroy(user.skills.image5.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(skills.image5, {
          folder: "portfolio",
        });

        user.skills.image5 = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (skills.image6) {
        // await cloudinary.v2.uploader.destroy(user.skills.image6.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(skills.image6, {
          folder: "portfolio",
        });

        user.skills.image6 = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }

    if (about) {
      if (about.name) {
        user.about.name = about.name;
      }
      if (about.title) {
        user.about.title = about.title;
      }
      if (about.subtitle) {
        user.about.subtitle = about.subtitle;
      }

      if (about.description) {
        user.about.description = about.description;
      }
      if (about.quote) {
        user.about.quote = about.quote;
      }

      if (about.avatar) {
        await cloudinary.v2.uploader.destroy(user.about.avatar.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(about.avatar, {
          folder: "portfolio",
        });

        user.about.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addTimeline = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const user = await User.findById(req.user._id);

    user.timeline.unshift({
      title,
      description,
      date,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added To Timline",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addYoutube = async (req, res) => {
  try {
    const { url, title, image } = req.body;

    const user = await User.findById(req.user._id);

    // console.log(image);
    // const myCloud = await cloudinary.v2.uploader.upload(image, {
    //   folder: "portfolio",
    // });
    // console.log(myCloud);
    user.youtube.unshift({
      url,
      title,
      // image: {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // },
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added To Youtube Videos",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addProject = async (req, res) => {
  try {
    const { url, title, image, description, techStack } = req.body;

    const user = await User.findById(req.user._id);

    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "portfolio",
    });
    user.projects.unshift({
      url,
      title,
      description,
      techStack,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added To Projects",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    user.timeline = user.timeline.filter((item) => item._id != id);

    // const index = user.timeline.indexOf(id);
    // user.timeline.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Deleted from Timline",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteYoutube = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const video = user.youtube.find((video) => video._id == id);

    // await cloudinary.v2.uploader.destroy(video.image.public_id);

    user.youtube = user.youtube.filter((video) => video._id != id);

    // const index = user.timeline.indexOf(id);
    // user.youtube.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Deleted from Youtube",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const project = user.projects.find((item) => item._id == id);

    // await cloudinary.v2.uploader.destroy(project.image.public_id);

    user.projects = user.projects.filter((item) => item._id != id);

    // const index = user.timeline.indexOf(id);
    // user.timeline.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Deleted from Projects",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};